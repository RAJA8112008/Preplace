window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-dp"] = {
  kind: "dsa",
  notes: [
    {
      title: "What dynamic programming is",
      body: "Dynamic programming (DP) is a way to answer a big question by answering smaller copies of the same question, then combining those answers. The small copies must overlap, so the same sub-question shows up more than once. They must also have optimal substructure: a best answer is built from best answers of the pieces. You name a state (what is still unknown), write a rule that fills that state from earlier states, and store each answer so you never recompute it. Fibonacci, climbing stairs, knapsack, and longest common subsequence all follow this shape."
    },
    {
      title: "Overlapping subproblems and optimal substructure",
      body: "Overlapping subproblems means the recursion tree repeats the same call. fib(5) calls fib(3) twice, and fib(2) many times. If you cache the first result, later calls are a lookup. Optimal substructure means the best answer for n is made from best answers for smaller n. Greedy also uses a local choice, but greedy never revisits a choice. DP keeps a table (or a memo) of every state you might need. If the subproblems do not overlap, plain divide-and-conquer is enough. If a local greedy choice can miss the global best, you need DP or search."
    },
    {
      title: "Memoization vs tabulation",
      body: "Memoization is top-down. You write the recursive function you already have, then store each (state -> answer) the first time you compute it. The call stack still exists. Only the states you actually reach are filled. Tabulation is bottom-up. You pick an order so that when you fill dp[i], every value it needs is already sitting in the table. Both give the same answers when the recurrence is the same. Memo is often faster to write from a recurrence. A table makes the order obvious and is easier to shrink to a few variables. Interviews like both: first the recurrence, then a table, then space cuts."
    },
    {
      title: "State and transition",
      body: "A state is the smallest bundle of facts that lets you finish the problem. For climbing stairs it is the stair index. For 0/1 knapsack it is (item index, leftover capacity). For LCS it is (i in text1, j in text2). The transition is the rule that fills one state from earlier ones: take or skip, one step or two, match a letter or drop a letter. Write the base cases first: empty string, zero capacity, stair 0. Then write the rule in one sentence. If you cannot name the state, you are not ready to code. If two different stories share a state, you will overwrite an answer you still need."
    },
    {
      title: "1D vs 2D tables",
      body: "A 1D table is a row indexed by one changing number: index, remaining sum, remaining capacity. Climbing stairs, house robber, coin change, and subset sum all fit. A 2D table is a grid: two strings, a grid of cells, or (item, capacity). LCS, edit distance, unique paths, and the full knapsack table are 2D. Many 2D tables only need the previous row, so you can store one or two rows. Walk the axes in the order the recurrence needs. Off-by-one on the empty prefix (index 0 meaning “no items”) is the usual bug. Draw a tiny table on paper before you type loops."
    },
    {
      title: "The knapsack family",
      body: "Knapsack is the family of “pick items under a budget” problems. 0/1 knapsack: each item at most once; loop capacity backwards in a 1D row so you do not reuse the same item. Unbounded knapsack: each item as many times as you like; loop capacity forwards. Bounded knapsack caps the count. Coin change (fewest coins) is unbounded min. Coin change 2 / combination count is unbounded ways. Partition equal subset sum is 0/1 subset-sum: can some subset hit total/2. Target sum maps onto the same subset-sum row. Once you know whether reuse is allowed, you know the loop direction."
    },
    {
      title: "Choose or skip, and grid paths",
      body: "A huge slice of DP is “at this index, take it or skip it.” House robber, 0/1 knapsack, and subset sum are that story. Another slice is a grid: you may only move right or down, so a cell is ways-from-above plus ways-from-left. Unique paths and unique paths with stones are that story. String DP is a third slice: two pointers on two strings (LCS, edit distance) or one pointer on one string (decode ways, word break). Naming the family in the first minute of an interview tells the interviewer you see the pattern, not just the LeetCode title."
    },
    {
      title: "Space optimization",
      body: "If dp[i] only needs dp[i-1] and dp[i-2], two variables replace the array. House robber and climbing stairs shrink this way. If a 2D cell only needs the previous row, keep prev and cur rows, or one row plus a saved diagonal. LCS and edit distance shrink this way. For 0/1 knapsack, walk capacity from high to low in one row so each item is used at most once. Do not shrink until the full table is correct. Interviewers often ask “can you cut the memory?” after you show O(n) or O(n*W). Say which cells are live, then drop the rest."
    },
    {
      title: "How to pick a pattern in an interview",
      body: "Ask: can I name a state whose answer I can reuse? If the answer is a count, a min, a max, or true/false on prefixes, try DP. If you must list every path, backtracking may be the real ask, with DP only to count. Draw n = 3 or a 3x3 grid. Write the last decision (last stair, last item, last character). If that decision splits into a few smaller problems with the same shape, you have a recurrence. Then pick memo or a table. Mention time as (number of states) times (work per state). That sentence is the complexity proof."
    }
  ],
  examples: [
    {
      lang: "js",
      title: "1. Fibonacci with a memo notebook",
      desc: "What this is\nFibonacci is the first DP picture. fib(n) = fib(n-1) + fib(n-2), with fib(0) = 0 and fib(1) = 1. The naive tree repeats fib(3) and fib(2) over and over.\n\nWhat the code is doing\ngo(k) asks for fib(k). If k is 0 or 1, it returns k. If memo[k] already holds a number, it returns that number. Otherwise it stores go(k-1)+go(k-2) in memo[k] and returns it. fib(6) then does each k from 2 to 6 once.\n\nWatch out\nThe array memo starts empty. undefined means “not filled yet.” Do not fill with 0, because fib(0) is 0 and you would skip real work. The call stack is still O(n).",
      code: `function fib(n) {
  const memo = [];
  function go(k) {
    if (k <= 1) return k;
    if (memo[k] !== undefined) return memo[k];
    memo[k] = go(k - 1) + go(k - 2);
    return memo[k];
  }
  return go(n);
}

console.log(fib(6)); // 8`,
      codes: {
        javascript: `function fib(n) {
  const memo = [];
  function go(k) {
    if (k <= 1) return k;
    if (memo[k] !== undefined) return memo[k];
    memo[k] = go(k - 1) + go(k - 2);
    return memo[k];
  }
  return go(n);
}

console.log(fib(6)); // 8`,
        python: `def fib(n):
    memo = {}
    def go(k):
        if k <= 1:
            return k
        if k in memo:
            return memo[k]
        memo[k] = go(k - 1) + go(k - 2)
        return memo[k]
    return go(n)

print(fib(6))  # 8`,
        java: `class Solution {
    public int fib(int n) {
        Integer[] memo = new Integer[n + 1];
        return go(n, memo);
    }
    private int go(int k, Integer[] memo) {
        if (k <= 1) return k;
        if (memo[k] != null) return memo[k];
        memo[k] = go(k - 1, memo) + go(k - 2, memo);
        return memo[k];
    }
    public static void main(String[] args) {
        System.out.println(new Solution().fib(6)); // 8
    }
}`,
        cpp: `int fib(int n) {
    vector<int> memo(n + 1, -1);
    function<int(int)> go = [&](int k) -> int {
        if (k <= 1) return k;
        if (memo[k] != -1) return memo[k];
        memo[k] = go(k - 1) + go(k - 2);
        return memo[k];
    };
    return go(n);
}

int main() {
    cout << fib(6) << endl; // 8
    return 0;
}`,
        c: `int go_fib(int k, int *memo) {
    if (k <= 1) return k;
    if (memo[k] != -1) return memo[k];
    memo[k] = go_fib(k - 1, memo) + go_fib(k - 2, memo);
    return memo[k];
}

int fib(int n) {
    int *memo = (int *)malloc((n + 1) * sizeof(int));
    int i, ans;
    for (i = 0; i <= n; i++) memo[i] = -1;
    ans = go_fib(n, memo);
    free(memo);
    return ans;
}

int main(void) {
    printf("%d", fib(6)); /* 8 */
    return 0;
}`
      }
    },
    {
      lang: "js",
      title: "2. Climbing stairs with a table",
      desc: "What this is\nYou may climb 1 or 2 stairs. ways(n) is how many ordered paths reach stair n. That is Fibonacci shifted by one: ways(n) = ways(n-1) + ways(n-2).\n\nWhat the code is doing\nways[0] = 1 means one way to stand on the ground (do nothing). ways[1] = 1 is a single step. Each later index is the sum of the previous two. The loop fills left to right so those two cells already exist. ways[n] is the answer.\n\nWatch out\nSome people set ways[0] = 0. Then ways[2] breaks. n = 0 and n = 1 are the base. The table uses O(n) extra memory; two rolling numbers can replace it later.",
      code: `function climbStairs(n) {
  if (n <= 1) return 1;
  const ways = Array(n + 1).fill(0);
  ways[0] = 1;
  ways[1] = 1;
  for (let i = 2; i <= n; i++) {
    ways[i] = ways[i - 1] + ways[i - 2];
  }
  return ways[n];
}

console.log(climbStairs(4)); // 5`,
      codes: {
        javascript: `function climbStairs(n) {
  if (n <= 1) return 1;
  const ways = Array(n + 1).fill(0);
  ways[0] = 1;
  ways[1] = 1;
  for (let i = 2; i <= n; i++) {
    ways[i] = ways[i - 1] + ways[i - 2];
  }
  return ways[n];
}

console.log(climbStairs(4)); // 5`,
        python: `def climbStairs(n):
    if n <= 1:
        return 1
    ways = [0] * (n + 1)
    ways[0] = 1
    ways[1] = 1
    for i in range(2, n + 1):
        ways[i] = ways[i - 1] + ways[i - 2]
    return ways[n]

print(climbStairs(4))  # 5`,
        java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 1) return 1;
        int[] ways = new int[n + 1];
        ways[0] = 1;
        ways[1] = 1;
        for (int i = 2; i <= n; i++) {
            ways[i] = ways[i - 1] + ways[i - 2];
        }
        return ways[n];
    }
    public static void main(String[] args) {
        System.out.println(new Solution().climbStairs(4)); // 5
    }
}`,
        cpp: `int climbStairs(int n) {
    if (n <= 1) return 1;
    vector<int> ways(n + 1, 0);
    ways[0] = 1;
    ways[1] = 1;
    for (int i = 2; i <= n; i++) {
        ways[i] = ways[i - 1] + ways[i - 2];
    }
    return ways[n];
}

int main() {
    cout << climbStairs(4) << endl; // 5
    return 0;
}`,
        c: `int climbStairs(int n) {
    int *ways, i, ans;
    if (n <= 1) return 1;
    ways = (int *)calloc(n + 1, sizeof(int));
    ways[0] = 1;
    ways[1] = 1;
    for (i = 2; i <= n; i++) {
        ways[i] = ways[i - 1] + ways[i - 2];
    }
    ans = ways[n];
    free(ways);
    return ans;
}

int main(void) {
    printf("%d", climbStairs(4)); /* 5 */
    return 0;
}`
      }
    },
    {
      lang: "js",
      title: "3. Choose or skip (house robber idea)",
      desc: "What this is\nAt house i you may take nums[i] and jump to i+2, or skip and go to i+1. Adjacent houses are not both allowed. The answer is the better of those two choices.\n\nWhat the code is doing\nbest[i] is the most money from the first i houses (index i-1). The loop starts at 1. take is this house plus best[i-2] (or 0 if there is no i-2). skip is best[i-1]. best[i] stores the max. The last cell is the answer for the whole street.\n\nWatch out\nbest is 1-based on count, nums is 0-based. Mixing those indexes is the usual bug. This is 0/1 choose-or-skip on a line, the same skeleton as knapsack without a weight.",
      code: `function rob(nums) {
  const n = nums.length;
  const best = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const take = nums[i - 1] + (i >= 2 ? best[i - 2] : 0);
    const skip = best[i - 1];
    best[i] = Math.max(take, skip);
  }
  return best[n];
}

console.log(rob([1, 2, 3, 1])); // 4`,
      codes: {
        javascript: `function rob(nums) {
  const n = nums.length;
  const best = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const take = nums[i - 1] + (i >= 2 ? best[i - 2] : 0);
    const skip = best[i - 1];
    best[i] = Math.max(take, skip);
  }
  return best[n];
}

console.log(rob([1, 2, 3, 1])); // 4`,
        python: `def rob(nums):
    n = len(nums)
    best = [0] * (n + 1)
    for i in range(1, n + 1):
        take = nums[i - 1] + (best[i - 2] if i >= 2 else 0)
        skip = best[i - 1]
        best[i] = max(take, skip)
    return best[n]

print(rob([1, 2, 3, 1]))  # 4`,
        java: `class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        int[] best = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            int take = nums[i - 1] + (i >= 2 ? best[i - 2] : 0);
            int skip = best[i - 1];
            best[i] = Math.max(take, skip);
        }
        return best[n];
    }
    public static void main(String[] args) {
        System.out.println(new Solution().rob(new int[] {1, 2, 3, 1})); // 4
    }
}`,
        cpp: `int rob(vector<int>& nums) {
    int n = nums.size();
    vector<int> best(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        int take = nums[i - 1] + (i >= 2 ? best[i - 2] : 0);
        int skip = best[i - 1];
        best[i] = max(take, skip);
    }
    return best[n];
}

int main() {
    vector<int> nums = {1, 2, 3, 1};
    cout << rob(nums) << endl; // 4
    return 0;
}`,
        c: `int rob(int *nums, int n) {
    int *best = (int *)calloc(n + 1, sizeof(int));
    int i, ans;
    for (i = 1; i <= n; i++) {
        int take = nums[i - 1] + (i >= 2 ? best[i - 2] : 0);
        int skip = best[i - 1];
        best[i] = take > skip ? take : skip;
    }
    ans = best[n];
    free(best);
    return ans;
}

int main(void) {
    int nums[] = {1, 2, 3, 1};
    printf("%d", rob(nums, 4)); /* 4 */
    return 0;
}`
      }
    },
    {
      lang: "js",
      title: "4. 0/1 knapsack table",
      desc: "What this is\nEach item has a value and a weight. You may take it at most once. Capacity is the bag limit. The goal is maximum total value that still fits.\n\nWhat the code is doing\ndp[i][w] is the best value using the first i items with capacity w. You always copy the skip answer dp[i-1][w]. If weights[i-1] fits, you also try value plus dp[i-1][w - weight]. The max of skip and take is stored. dp[n][capacity] is the answer.\n\nWatch out\nItem i in the table is index i-1 in the arrays. If you loop the 1D row from left to right, you will reuse the same item (unbounded). 0/1 needs the backwards inner loop, shown in a later example.",
      code: `function knapsack(values, weights, capacity) {
  const n = values.length;
  const dp = Array.from({ length: n + 1 }, function () {
    return Array(capacity + 1).fill(0);
  });
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w) {
        const take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
        dp[i][w] = Math.max(dp[i][w], take);
      }
    }
  }
  return dp[n][capacity];
}

console.log(knapsack([6, 10, 12], [1, 2, 3], 5)); // 22`,
      codes: {
        javascript: `function knapsack(values, weights, capacity) {
  const n = values.length;
  const dp = Array.from({ length: n + 1 }, function () {
    return Array(capacity + 1).fill(0);
  });
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w) {
        const take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
        dp[i][w] = Math.max(dp[i][w], take);
      }
    }
  }
  return dp[n][capacity];
}

console.log(knapsack([6, 10, 12], [1, 2, 3], 5)); // 22`,
        python: `def knapsack(values, weights, capacity):
    n = len(values)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(0, capacity + 1):
            dp[i][w] = dp[i - 1][w]
            if weights[i - 1] <= w:
                take = dp[i - 1][w - weights[i - 1]] + values[i - 1]
                dp[i][w] = max(dp[i][w], take)
    return dp[n][capacity]

print(knapsack([6, 10, 12], [1, 2, 3], 5))  # 22`,
        java: `class Solution {
    public int knapsack(int[] values, int[] weights, int capacity) {
        int n = values.length;
        int[][] dp = new int[n + 1][capacity + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                dp[i][w] = dp[i - 1][w];
                if (weights[i - 1] <= w) {
                    int take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
                    dp[i][w] = Math.max(dp[i][w], take);
                }
            }
        }
        return dp[n][capacity];
    }
    public static void main(String[] args) {
        System.out.println(new Solution().knapsack(
            new int[] {6, 10, 12}, new int[] {1, 2, 3}, 5)); // 22
    }
}`,
        cpp: `int knapsack(vector<int>& values, vector<int>& weights, int capacity) {
    int n = values.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];
            if (weights[i - 1] <= w) {
                int take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
                dp[i][w] = max(dp[i][w], take);
            }
        }
    }
    return dp[n][capacity];
}

int main() {
    vector<int> values = {6, 10, 12};
    vector<int> weights = {1, 2, 3};
    cout << knapsack(values, weights, 5) << endl; // 22
    return 0;
}`,
        c: `int knapsack(int *values, int *weights, int n, int capacity) {
    int **dp = (int **)malloc((n + 1) * sizeof(int *));
    int i, w, ans;
    for (i = 0; i <= n; i++) dp[i] = (int *)calloc(capacity + 1, sizeof(int));
    for (i = 1; i <= n; i++) {
        for (w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];
            if (weights[i - 1] <= w) {
                int take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
                if (take > dp[i][w]) dp[i][w] = take;
            }
        }
    }
    ans = dp[n][capacity];
    for (i = 0; i <= n; i++) free(dp[i]);
    free(dp);
    return ans;
}

int main(void) {
    int values[] = {6, 10, 12};
    int weights[] = {1, 2, 3};
    printf("%d", knapsack(values, weights, 3, 5)); /* 22 */
    return 0;
}`
      }
    },
    {
      lang: "js",
      title: "5. Unbounded knapsack (coin change, fewest coins)",
      desc: "What this is\nYou have coin values. You may use each coin as many times as you like. Return the fewest coins that sum to amount, or -1 if it is impossible.\n\nWhat the code is doing\nbest[s] is the fewest coins to make sum s. best[0] = 0. Every other cell starts at Infinity. For each sum s, each coin that fits offers 1 + best[s - coin]. The min of those options is stored. If the cell stays Infinity, return -1.\n\nWatch out\nThis inner loop walks coins for a fixed s, so reuse is allowed. That is unbounded. If you need the number of combinations instead of fewest coins, you add ways, you do not take min. Infinity means “cannot make this sum yet.”",
      code: `function coinChange(coins, amount) {
  const best = Array(amount + 1).fill(Infinity);
  best[0] = 0;
  for (let s = 1; s <= amount; s++) {
    for (let c = 0; c < coins.length; c++) {
      const coin = coins[c];
      if (coin <= s) {
        best[s] = Math.min(best[s], best[s - coin] + 1);
      }
    }
  }
  return best[amount] === Infinity ? -1 : best[amount];
}

console.log(coinChange([1, 3, 4], 6)); // 2  (3+3)`,
      codes: {
        javascript: `function coinChange(coins, amount) {
  const best = Array(amount + 1).fill(Infinity);
  best[0] = 0;
  for (let s = 1; s <= amount; s++) {
    for (let c = 0; c < coins.length; c++) {
      const coin = coins[c];
      if (coin <= s) {
        best[s] = Math.min(best[s], best[s - coin] + 1);
      }
    }
  }
  return best[amount] === Infinity ? -1 : best[amount];
}

console.log(coinChange([1, 3, 4], 6)); // 2  (3+3)`,
        python: `def coinChange(coins, amount):
    INF = 10 ** 9
    best = [INF] * (amount + 1)
    best[0] = 0
    for s in range(1, amount + 1):
        for coin in coins:
            if coin <= s:
                best[s] = min(best[s], best[s - coin] + 1)
    return -1 if best[amount] == INF else best[amount]

print(coinChange([1, 3, 4], 6))  # 2  (3+3)`,
        java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int INF = 1000000000;
        int[] best = new int[amount + 1];
        java.util.Arrays.fill(best, INF);
        best[0] = 0;
        for (int s = 1; s <= amount; s++) {
            for (int c = 0; c < coins.length; c++) {
                int coin = coins[c];
                if (coin <= s) best[s] = Math.min(best[s], best[s - coin] + 1);
            }
        }
        return best[amount] == INF ? -1 : best[amount];
    }
    public static void main(String[] args) {
        System.out.println(new Solution().coinChange(new int[] {1, 3, 4}, 6)); // 2
    }
}`,
        cpp: `int coinChange(vector<int>& coins, int amount) {
    const int INF = 1000000000;
    vector<int> best(amount + 1, INF);
    best[0] = 0;
    for (int s = 1; s <= amount; s++) {
        for (int c = 0; c < (int)coins.size(); c++) {
            int coin = coins[c];
            if (coin <= s) best[s] = min(best[s], best[s - coin] + 1);
        }
    }
    return best[amount] == INF ? -1 : best[amount];
}

int main() {
    vector<int> coins = {1, 3, 4};
    cout << coinChange(coins, 6) << endl; // 2  (3+3)
    return 0;
}`,
        c: `int coinChange(int *coins, int n, int amount) {
    const int INF = 1000000000;
    int *best = (int *)malloc((amount + 1) * sizeof(int));
    int s, c, ans;
    for (s = 0; s <= amount; s++) best[s] = INF;
    best[0] = 0;
    for (s = 1; s <= amount; s++) {
        for (c = 0; c < n; c++) {
            int coin = coins[c];
            if (coin <= s && best[s - coin] + 1 < best[s]) {
                best[s] = best[s - coin] + 1;
            }
        }
    }
    ans = best[amount] == INF ? -1 : best[amount];
    free(best);
    return ans;
}

int main(void) {
    int coins[] = {1, 3, 4};
    printf("%d", coinChange(coins, 3, 6)); /* 2  (3+3) */
    return 0;
}`
      }
    },
    {
      lang: "js",
      title: "6. Longest increasing subsequence (length sketch)",
      desc: "What this is\nA subsequence keeps order but may skip items. Increasing means strictly larger numbers. You want the length of the longest such subsequence, not the list itself.\n\nWhat the code is doing\nlen[i] is the LIS that must end at index i. It starts at 1 (the item alone). For every earlier j, if nums[j] < nums[i], you may extend that subsequence: len[j] + 1. best tracks the max over all i. That max is the LIS length for the whole array.\n\nWatch out\nThis is O(n^2). A tails array plus binary search is O(n log n) and appears in the question tabs. Subsequence is not subarray: you may skip. Equal numbers do not extend a strictly increasing run.",
      code: `function lengthOfLIS(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  const len = Array(n).fill(1);
  let best = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        len[i] = Math.max(len[i], len[j] + 1);
      }
    }
    best = Math.max(best, len[i]);
  }
  return best;
}

console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4`,
      codes: {
        javascript: `function lengthOfLIS(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  const len = Array(n).fill(1);
  let best = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        len[i] = Math.max(len[i], len[j] + 1);
      }
    }
    best = Math.max(best, len[i]);
  }
  return best;
}

console.log(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])); // 4`,
        python: `def lengthOfLIS(nums):
    n = len(nums)
    if n == 0:
        return 0
    length = [1] * n
    best = 1
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                length[i] = max(length[i], length[j] + 1)
        best = max(best, length[i])
    return best

print(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18]))  # 4`,
        java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        int[] len = new int[n];
        java.util.Arrays.fill(len, 1);
        int best = 1;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    len[i] = Math.max(len[i], len[j] + 1);
                }
            }
            best = Math.max(best, len[i]);
        }
        return best;
    }
    public static void main(String[] args) {
        System.out.println(new Solution().lengthOfLIS(
            new int[] {10, 9, 2, 5, 3, 7, 101, 18})); // 4
    }
}`,
        cpp: `int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    if (n == 0) return 0;
    vector<int> len(n, 1);
    int best = 1;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                len[i] = max(len[i], len[j] + 1);
            }
        }
        best = max(best, len[i]);
    }
    return best;
}

int main() {
    vector<int> nums = {10, 9, 2, 5, 3, 7, 101, 18};
    cout << lengthOfLIS(nums) << endl; // 4
    return 0;
}`,
        c: `int lengthOfLIS(int *nums, int n) {
    int *len, i, j, best, ans;
    if (n == 0) return 0;
    len = (int *)malloc(n * sizeof(int));
    for (i = 0; i < n; i++) len[i] = 1;
    best = 1;
    for (i = 0; i < n; i++) {
        for (j = 0; j < i; j++) {
            if (nums[j] < nums[i] && len[j] + 1 > len[i]) {
                len[i] = len[j] + 1;
            }
        }
        if (len[i] > best) best = len[i];
    }
    ans = best;
    free(len);
    return ans;
}

int main(void) {
    int nums[] = {10, 9, 2, 5, 3, 7, 101, 18};
    printf("%d", lengthOfLIS(nums, 8)); /* 4 */
    return 0;
}`
      }
    },
    {
      lang: "js",
      title: "7. Longest common subsequence, 2D table",
      desc: "What this is\nLCS is the longest string of letters that can be formed from both texts by deleting letters, never reordering. “ace” is an LCS of “abcde” and “ace”.\n\nWhat the code is doing\ndp[i][j] is LCS length of the first i letters of text1 and the first j of text2. Row 0 and column 0 stay 0 (empty prefix). If the two letters match, you take the diagonal plus one. If they differ, you take the better of dropping a letter from text1 or from text2.\n\nWatch out\nMatch uses i-1 and j-1 in the strings because the table is 1-based on length. Reconstructing the actual letters needs a second walk back through the table. Interviews often only want the length.",
      code: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, function () {
    return Array(n + 1).fill(0);
  });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

console.log(longestCommonSubsequence("abcde", "ace")); // 3`,
      codes: {
        javascript: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, function () {
    return Array(n + 1).fill(0);
  });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}

console.log(longestCommonSubsequence("abcde", "ace")); // 3`,
        python: `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]

print(longestCommonSubsequence("abcde", "ace"))  # 3`,
        java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
    public static void main(String[] args) {
        System.out.println(new Solution().longestCommonSubsequence("abcde", "ace")); // 3
    }
}`,
        cpp: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}

int main() {
    cout << longestCommonSubsequence("abcde", "ace") << endl; // 3
    return 0;
}`,
        c: `int longestCommonSubsequence(const char *text1, const char *text2) {
    int m = (int)strlen(text1), n = (int)strlen(text2);
    int **dp = (int **)malloc((m + 1) * sizeof(int *));
    int i, j, ans;
    for (i = 0; i <= m; i++) dp[i] = (int *)calloc(n + 1, sizeof(int));
    for (i = 1; i <= m; i++) {
        for (j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = dp[i - 1][j] > dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];
        }
    }
    ans = dp[m][n];
    for (i = 0; i <= m; i++) free(dp[i]);
    free(dp);
    return ans;
}

int main(void) {
    printf("%d", longestCommonSubsequence("abcde", "ace")); /* 3 */
    return 0;
}`
      }
    },
    {
      lang: "js",
      title: "8. Unique paths on a grid",
      desc: "What this is\nA robot starts at the top-left of an m by n grid and may only move right or down. Count paths to the bottom-right.\n\nWhat the code is doing\nways[r][c] is paths to that cell. The first row and first column are 1: only one corridor. Every other cell is ways from above plus ways from the left. The bottom-right cell is the answer.\n\nWatch out\nThis counts paths, it does not list them. Obstacles zero a cell (Unique Paths II). The same grid can be stored as one row: a cell becomes left-in-this-row plus the old value (the cell above).",
      code: `function uniquePaths(m, n) {
  const ways = Array.from({ length: m }, function () {
    return Array(n).fill(0);
  });
  for (let r = 0; r < m; r++) ways[r][0] = 1;
  for (let c = 0; c < n; c++) ways[0][c] = 1;
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
    }
  }
  return ways[m - 1][n - 1];
}

console.log(uniquePaths(3, 7)); // 28`,
      codes: {
        javascript: `function uniquePaths(m, n) {
  const ways = Array.from({ length: m }, function () {
    return Array(n).fill(0);
  });
  for (let r = 0; r < m; r++) ways[r][0] = 1;
  for (let c = 0; c < n; c++) ways[0][c] = 1;
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
    }
  }
  return ways[m - 1][n - 1];
}

console.log(uniquePaths(3, 7)); // 28`,
        python: `def uniquePaths(m, n):
    ways = [[0] * n for _ in range(m)]
    for r in range(m):
        ways[r][0] = 1
    for c in range(n):
        ways[0][c] = 1
    for r in range(1, m):
        for c in range(1, n):
            ways[r][c] = ways[r - 1][c] + ways[r][c - 1]
    return ways[m - 1][n - 1]

print(uniquePaths(3, 7))  # 28`,
        java: `class Solution {
    public int uniquePaths(int m, int n) {
        int[][] ways = new int[m][n];
        for (int r = 0; r < m; r++) ways[r][0] = 1;
        for (int c = 0; c < n; c++) ways[0][c] = 1;
        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) {
                ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
            }
        }
        return ways[m - 1][n - 1];
    }
    public static void main(String[] args) {
        System.out.println(new Solution().uniquePaths(3, 7)); // 28
    }
}`,
        cpp: `int uniquePaths(int m, int n) {
    vector<vector<int>> ways(m, vector<int>(n, 0));
    for (int r = 0; r < m; r++) ways[r][0] = 1;
    for (int c = 0; c < n; c++) ways[0][c] = 1;
    for (int r = 1; r < m; r++) {
        for (int c = 1; c < n; c++) {
            ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
        }
    }
    return ways[m - 1][n - 1];
}

int main() {
    cout << uniquePaths(3, 7) << endl; // 28
    return 0;
}`,
        c: `int uniquePaths(int m, int n) {
    int **ways = (int **)malloc(m * sizeof(int *));
    int r, c, ans;
    for (r = 0; r < m; r++) ways[r] = (int *)calloc(n, sizeof(int));
    for (r = 0; r < m; r++) ways[r][0] = 1;
    for (c = 0; c < n; c++) ways[0][c] = 1;
    for (r = 1; r < m; r++) {
        for (c = 1; c < n; c++) {
            ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
        }
    }
    ans = ways[m - 1][n - 1];
    for (r = 0; r < m; r++) free(ways[r]);
    free(ways);
    return ans;
}

int main(void) {
    printf("%d", uniquePaths(3, 7)); /* 28 */
    return 0;
}`
      }
    },
    {
      lang: "js",
      title: "9. Subset sum on one boolean row",
      desc: "What this is\nSubset sum asks whether some 0/1 subset of nums adds to need. Partition equal subset sum is this problem with need = total/2.\n\nWhat the code is doing\ncan[s] is true if some subset of the items processed so far adds to s. can[0] is true (empty subset). For each number you walk s from need down to num. If can[s - num] is already true, can[s] becomes true. Walking backwards stops the same number from being used twice in one pass.\n\nWatch out\nA forward inner loop would be unbounded (the coin-change ways bug). If total is odd, partition is immediately false. This row is the space-optimized 0/1 knapsack of weights only.",
      code: `function canMake(nums, need) {
  const can = Array(need + 1).fill(false);
  can[0] = true;
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    for (let s = need; s >= num; s--) {
      if (can[s - num]) can[s] = true;
    }
  }
  return can[need];
}

console.log(canMake([1, 5, 11, 5], 11)); // true`,
      codes: {
        javascript: `function canMake(nums, need) {
  const can = Array(need + 1).fill(false);
  can[0] = true;
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    for (let s = need; s >= num; s--) {
      if (can[s - num]) can[s] = true;
    }
  }
  return can[need];
}

console.log(canMake([1, 5, 11, 5], 11)); // true`,
        python: `def canMake(nums, need):
    can = [False] * (need + 1)
    can[0] = True
    for num in nums:
        for s in range(need, num - 1, -1):
            if can[s - num]:
                can[s] = True
    return can[need]

print(canMake([1, 5, 11, 5], 11))  # True`,
        java: `class Solution {
    public boolean canMake(int[] nums, int need) {
        boolean[] can = new boolean[need + 1];
        can[0] = true;
        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];
            for (int s = need; s >= num; s--) {
                if (can[s - num]) can[s] = true;
            }
        }
        return can[need];
    }
    public static void main(String[] args) {
        System.out.println(new Solution().canMake(new int[] {1, 5, 11, 5}, 11)); // true
    }
}`,
        cpp: `bool canMake(vector<int>& nums, int need) {
    vector<char> can(need + 1, 0);
    can[0] = 1;
    for (int i = 0; i < (int)nums.size(); i++) {
        int num = nums[i];
        for (int s = need; s >= num; s--) {
            if (can[s - num]) can[s] = 1;
        }
    }
    return can[need];
}

int main() {
    vector<int> nums = {1, 5, 11, 5};
    cout << (canMake(nums, 11) ? "true" : "false") << endl; // true
    return 0;
}`,
        c: `int canMake(int *nums, int n, int need) {
    int *can = (int *)calloc(need + 1, sizeof(int));
    int i, s, ans;
    can[0] = 1;
    for (i = 0; i < n; i++) {
        int num = nums[i];
        for (s = need; s >= num; s--) {
            if (can[s - num]) can[s] = 1;
        }
    }
    ans = can[need];
    free(can);
    return ans;
}

int main(void) {
    int nums[] = {1, 5, 11, 5};
    printf("%s", canMake(nums, 4, 11) ? "true" : "false"); /* true */
    return 0;
}`
      }
    },
    {
      lang: "js",
      title: "10. Two rolling numbers (space cut)",
      desc: "What this is\nWhen a 1D recurrence only reads the last two answers, you do not need an array. Climbing stairs and Fibonacci shrink to two numbers you slide forward.\n\nWhat the code is doing\na is ways to reach i-2. b is ways to reach i-1. Each round, next is a+b, then a becomes the old b, and b becomes next. After the loop, b is ways(n). The same slide works for house robber if you store skip and take.\n\nWatch out\nInitialize a and b from the real base cases. Off-by-one on the loop bounds is common (i from 3 to n vs 2 to n). This is the “More optimal” tab on many 1D DP questions.",
      code: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

console.log(climbStairs(5)); // 8`,
      codes: {
        javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}

console.log(climbStairs(5)); // 8`,
        python: `def climbStairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for i in range(3, n + 1):
        nxt = a + b
        a = b
        b = nxt
    return b

print(climbStairs(5))  # 8`,
        java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int next = a + b;
            a = b;
            b = next;
        }
        return b;
    }
    public static void main(String[] args) {
        System.out.println(new Solution().climbStairs(5)); // 8
    }
}`,
        cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int next = a + b;
        a = b;
        b = next;
    }
    return b;
}

int main() {
    cout << climbStairs(5) << endl; // 8
    return 0;
}`,
        c: `int climbStairs(int n) {
    int a, b, i, next;
    if (n <= 2) return n;
    a = 1;
    b = 2;
    for (i = 3; i <= n; i++) {
        next = a + b;
        a = b;
        b = next;
    }
    return b;
}

int main(void) {
    printf("%d", climbStairs(5)); /* 8 */
    return 0;
}`
      }
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "Climbing Stairs",
      ask: "Amazon · Google · Microsoft",
      a: "You start on stair 0. From any stair you may climb 1 step or 2 steps. Return how many distinct ordered paths reach stair n.\n\nTiny example: n = 3. The paths are 1+1+1, 1+2, and 2+1. Answer 3. (2+1 and 1+2 are different orders, so both count.)\n\nThe last move is a 1 from n-1 or a 2 from n-2, so ways(n) = ways(n-1) + ways(n-2), with ways(1) = 1 and ways(2) = 2. That is Fibonacci shifted by one.\n\nOpen the Brute, Optimal, and More optimal tabs for the raw recursion tree, a memo notebook, and two rolling numbers.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n)",
          space: "O(n)",
          why: "Each stair branches into two calls. The same k is solved again and again, so the tree is exponential. Space is the recursion depth n.",
          code: `function climbStairs(n) {
  if (n <= 2) return n;
  return climbStairs(n - 1) + climbStairs(n - 2);
}`,
          codes: {
            javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  return climbStairs(n - 1) + climbStairs(n - 2);
}`,
            python: `def climbStairs(n):
    if n <= 2:
        return n
    return climbStairs(n - 1) + climbStairs(n - 2)`,
            java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        return climbStairs(n - 1) + climbStairs(n - 2);
    }
}`,
            cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    return climbStairs(n - 1) + climbStairs(n - 2);
}`,
            c: `int climbStairs(int n) {
    if (n <= 2) return n;
    return climbStairs(n - 1) + climbStairs(n - 2);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Memo stores each k once. After the first fill, go(k) is a lookup. You still use O(n) stack plus O(n) memo cells. Same recurrence, no repeated subtrees.",
          code: `function climbStairs(n) {
  const memo = [];
  function go(k) {
    if (k <= 2) return k;
    if (memo[k] !== undefined) return memo[k];
    memo[k] = go(k - 1) + go(k - 2);
    return memo[k];
  }
  return go(n);
}`,
          codes: {
            javascript: `function climbStairs(n) {
  const memo = [];
  function go(k) {
    if (k <= 2) return k;
    if (memo[k] !== undefined) return memo[k];
    memo[k] = go(k - 1) + go(k - 2);
    return memo[k];
  }
  return go(n);
}`,
            python: `def climbStairs(n):
    memo = {}
    def go(k):
        if k <= 2:
            return k
        if k in memo:
            return memo[k]
        memo[k] = go(k - 1) + go(k - 2)
        return memo[k]
    return go(n)`,
            java: `class Solution {
    public int climbStairs(int n) {
        Integer[] memo = new Integer[n + 1];
        return go(n, memo);
    }
    private int go(int k, Integer[] memo) {
        if (k <= 2) return k;
        if (memo[k] != null) return memo[k];
        memo[k] = go(k - 1, memo) + go(k - 2, memo);
        return memo[k];
    }
}`,
            cpp: `int climbStairs(int n) {
    vector<int> memo(n + 1, -1);
    function<int(int)> go = [&](int k) -> int {
        if (k <= 2) return k;
        if (memo[k] != -1) return memo[k];
        memo[k] = go(k - 1) + go(k - 2);
        return memo[k];
    };
    return go(n);
}`,
            c: `int goClimb(int k, int *memo) {
    if (k <= 2) return k;
    if (memo[k] != -1) return memo[k];
    memo[k] = goClimb(k - 1, memo) + goClimb(k - 2, memo);
    return memo[k];
}
int climbStairs(int n) {
    int *memo = (int *)malloc((n + 1) * sizeof(int));
    int i, ans;
    for (i = 0; i <= n; i++) memo[i] = -1;
    ans = goClimb(n, memo);
    free(memo);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Only the previous two answers are live. a is ways(i-2), b is ways(i-1). Slide them forward n-2 times. Time stays linear; extra memory is two numbers.",
          code: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}`,
          codes: {
            javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let a = 1;
  let b = 2;
  for (let i = 3; i <= n; i++) {
    const next = a + b;
    a = b;
    b = next;
  }
  return b;
}`,
            python: `def climbStairs(n):
    if n <= 2:
        return n
    a, b = 1, 2
    for i in range(3, n + 1):
        nxt = a + b
        a = b
        b = nxt
    return b`,
            java: `class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; i++) {
            int next = a + b;
            a = b;
            b = next;
        }
        return b;
    }
}`,
            cpp: `int climbStairs(int n) {
    if (n <= 2) return n;
    int a = 1, b = 2;
    for (int i = 3; i <= n; i++) {
        int next = a + b;
        a = b;
        b = next;
    }
    return b;
}`,
            c: `int climbStairs(int n) {
    int a, b, i, next;
    if (n <= 2) return n;
    a = 1;
    b = 2;
    for (i = 3; i <= n; i++) {
        next = a + b;
        a = b;
        b = next;
    }
    return b;
}`
          }
        }
      ]
    },
    {
      id: 2,
      level: "beginner",
      q: "House Robber",
      ask: "Amazon · Google · Apple",
      a: "Houses sit in a line. nums[i] is the money in house i. You may not rob two adjacent houses. Return the maximum total.\n\nTiny example: [1, 2, 3, 1]. Taking 1 and 3 (indexes 0 and 2) gives 4. Taking 2 and 1 (indexes 1 and 3) gives 3. Answer 4.\n\nAt index i the choice is take nums[i] and jump to i+2, or skip and go to i+1. The answer is the max of those two.\n\nOpen the Brute, Optimal, and More optimal tabs for recursion, a 1D table, and two running totals.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n)",
          space: "O(n)",
          why: "Every house branches into take or skip with no cache, so the tree is exponential. The stack is one frame per house along a path.",
          code: `function rob(nums) {
  function go(i) {
    if (i >= nums.length) return 0;
    const take = nums[i] + go(i + 2);
    const skip = go(i + 1);
    return Math.max(take, skip);
  }
  return go(0);
}`,
          codes: {
            javascript: `function rob(nums) {
  function go(i) {
    if (i >= nums.length) return 0;
    const take = nums[i] + go(i + 2);
    const skip = go(i + 1);
    return Math.max(take, skip);
  }
  return go(0);
}`,
            python: `def rob(nums):
    def go(i):
        if i >= len(nums):
            return 0
        take = nums[i] + go(i + 2)
        skip = go(i + 1)
        return max(take, skip)
    return go(0)`,
            java: `class Solution {
    public int rob(int[] nums) {
        return go(nums, 0);
    }
    private int go(int[] nums, int i) {
        if (i >= nums.length) return 0;
        int take = nums[i] + go(nums, i + 2);
        int skip = go(nums, i + 1);
        return Math.max(take, skip);
    }
}`,
            cpp: `int robGo(vector<int>& nums, int i) {
    if (i >= (int)nums.size()) return 0;
    int take = nums[i] + robGo(nums, i + 2);
    int skip = robGo(nums, i + 1);
    return max(take, skip);
}
int rob(vector<int>& nums) {
    return robGo(nums, 0);
}`,
            c: `int robGo(int *nums, int n, int i) {
    if (i >= n) return 0;
    int take = nums[i] + robGo(nums, n, i + 2);
    int skip = robGo(nums, n, i + 1);
    return take > skip ? take : skip;
}
int rob(int *nums, int n) {
    return robGo(nums, n, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "best[i] is the best total using the first i houses. Each i is filled from i-1 and i-2 in constant time. n states, linear time and linear extra memory.",
          code: `function rob(nums) {
  const n = nums.length;
  const best = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const take = nums[i - 1] + (i >= 2 ? best[i - 2] : 0);
    const skip = best[i - 1];
    best[i] = Math.max(take, skip);
  }
  return best[n];
}`,
          codes: {
            javascript: `function rob(nums) {
  const n = nums.length;
  const best = Array(n + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    const take = nums[i - 1] + (i >= 2 ? best[i - 2] : 0);
    const skip = best[i - 1];
    best[i] = Math.max(take, skip);
  }
  return best[n];
}`,
            python: `def rob(nums):
    n = len(nums)
    best = [0] * (n + 1)
    for i in range(1, n + 1):
        take = nums[i - 1] + (best[i - 2] if i >= 2 else 0)
        skip = best[i - 1]
        best[i] = max(take, skip)
    return best[n]`,
            java: `class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        int[] best = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            int take = nums[i - 1] + (i >= 2 ? best[i - 2] : 0);
            int skip = best[i - 1];
            best[i] = Math.max(take, skip);
        }
        return best[n];
    }
}`,
            cpp: `int rob(vector<int>& nums) {
    int n = nums.size();
    vector<int> best(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        int take = nums[i - 1] + (i >= 2 ? best[i - 2] : 0);
        int skip = best[i - 1];
        best[i] = max(take, skip);
    }
    return best[n];
}`,
            c: `int rob(int *nums, int n) {
    int *best = (int *)calloc(n + 1, sizeof(int));
    int i, ans;
    for (i = 1; i <= n; i++) {
        int take = nums[i - 1] + (i >= 2 ? best[i - 2] : 0);
        int skip = best[i - 1];
        best[i] = take > skip ? take : skip;
    }
    ans = best[n];
    free(best);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Only skip (best without the previous house as a take-chain) and take (best that used the previous house) are live. One pass updates both. Same linear scan, constant extra memory.",
          code: `function rob(nums) {
  let skip = 0;
  let take = 0;
  for (let i = 0; i < nums.length; i++) {
    const nextTake = skip + nums[i];
    skip = Math.max(skip, take);
    take = nextTake;
  }
  return Math.max(skip, take);
}`,
          codes: {
            javascript: `function rob(nums) {
  let skip = 0;
  let take = 0;
  for (let i = 0; i < nums.length; i++) {
    const nextTake = skip + nums[i];
    skip = Math.max(skip, take);
    take = nextTake;
  }
  return Math.max(skip, take);
}`,
            python: `def rob(nums):
    skip = 0
    take = 0
    for x in nums:
        nextTake = skip + x
        skip = max(skip, take)
        take = nextTake
    return max(skip, take)`,
            java: `class Solution {
    public int rob(int[] nums) {
        int skip = 0, take = 0;
        for (int i = 0; i < nums.length; i++) {
            int nextTake = skip + nums[i];
            skip = Math.max(skip, take);
            take = nextTake;
        }
        return Math.max(skip, take);
    }
}`,
            cpp: `int rob(vector<int>& nums) {
    int skip = 0, take = 0;
    for (int i = 0; i < (int)nums.size(); i++) {
        int nextTake = skip + nums[i];
        skip = max(skip, take);
        take = nextTake;
    }
    return max(skip, take);
}`,
            c: `int rob(int *nums, int n) {
    int skip = 0, take = 0, i;
    for (i = 0; i < n; i++) {
        int nextTake = skip + nums[i];
        skip = skip > take ? skip : take;
        take = nextTake;
    }
    return skip > take ? skip : take;
}`
          }
        }
      ]
    },
    {
      id: 3,
      level: "intermediate",
      q: "House Robber II",
      ask: "Google · Amazon · Microsoft",
      a: "Houses sit on a circle: the first and last houses are adjacent, so you cannot rob both. Return the maximum total.\n\nTiny example: [2, 3, 2]. If you take the first 2 you cannot take the last 2, so the best is 3. Answer 3.\n\nThe circle splits into two linear streets: rob houses [0 .. n-2] or rob houses [1 .. n-1]. Take the max of those two linear answers. A single house is the one extra base case.\n\nOpen the Brute, Optimal, and More optimal tabs for two exponential lines, two DP arrays, and two rolling passes.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n)",
          space: "O(n)",
          why: "Each range is still a take/skip tree with no memo. Two ranges do not change the exponential shape. Stack depth is O(n).",
          code: `function rob(nums) {
  const n = nums.length;
  if (n === 1) return nums[0];
  function go(i, end) {
    if (i > end) return 0;
    const take = nums[i] + go(i + 2, end);
    const skip = go(i + 1, end);
    return Math.max(take, skip);
  }
  return Math.max(go(0, n - 2), go(1, n - 1));
}`,
          codes: {
            javascript: `function rob(nums) {
  const n = nums.length;
  if (n === 1) return nums[0];
  function go(i, end) {
    if (i > end) return 0;
    const take = nums[i] + go(i + 2, end);
    const skip = go(i + 1, end);
    return Math.max(take, skip);
  }
  return Math.max(go(0, n - 2), go(1, n - 1));
}`,
            python: `def rob(nums):
    n = len(nums)
    if n == 1:
        return nums[0]
    def go(i, end):
        if i > end:
            return 0
        take = nums[i] + go(i + 2, end)
        skip = go(i + 1, end)
        return max(take, skip)
    return max(go(0, n - 2), go(1, n - 1))`,
            java: `class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        return Math.max(go(nums, 0, n - 2), go(nums, 1, n - 1));
    }
    private int go(int[] nums, int i, int end) {
        if (i > end) return 0;
        int take = nums[i] + go(nums, i + 2, end);
        int skip = go(nums, i + 1, end);
        return Math.max(take, skip);
    }
}`,
            cpp: `int robGoRange(vector<int>& nums, int i, int end) {
    if (i > end) return 0;
    int take = nums[i] + robGoRange(nums, i + 2, end);
    int skip = robGoRange(nums, i + 1, end);
    return max(take, skip);
}
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    return max(robGoRange(nums, 0, n - 2), robGoRange(nums, 1, n - 1));
}`,
            c: `int robGoRange(int *nums, int i, int end) {
    if (i > end) return 0;
    int take = nums[i] + robGoRange(nums, i + 2, end);
    int skip = robGoRange(nums, i + 1, end);
    return take > skip ? take : skip;
}
int rob(int *nums, int n) {
    int a, b;
    if (n == 1) return nums[0];
    a = robGoRange(nums, 0, n - 2);
    b = robGoRange(nums, 1, n - 1);
    return a > b ? a : b;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Each linear street is the house-robber table. Two passes, each O(n) states. You still store a best[] array per pass. Handles n = 1 before splitting.",
          code: `function rob(nums) {
  const n = nums.length;
  if (n === 1) return nums[0];
  function robLine(start, end) {
    const len = end - start + 1;
    const best = Array(len).fill(0);
    for (let i = start; i <= end; i++) {
      const j = i - start;
      const take = nums[i] + (j >= 2 ? best[j - 2] : 0);
      const skip = j >= 1 ? best[j - 1] : 0;
      best[j] = Math.max(take, skip);
    }
    return best[len - 1];
  }
  return Math.max(robLine(0, n - 2), robLine(1, n - 1));
}`,
          codes: {
            javascript: `function rob(nums) {
  const n = nums.length;
  if (n === 1) return nums[0];
  function robLine(start, end) {
    const len = end - start + 1;
    const best = Array(len).fill(0);
    for (let i = start; i <= end; i++) {
      const j = i - start;
      const take = nums[i] + (j >= 2 ? best[j - 2] : 0);
      const skip = j >= 1 ? best[j - 1] : 0;
      best[j] = Math.max(take, skip);
    }
    return best[len - 1];
  }
  return Math.max(robLine(0, n - 2), robLine(1, n - 1));
}`,
            python: `def rob(nums):
    n = len(nums)
    if n == 1:
        return nums[0]
    def robLine(start, end):
        length = end - start + 1
        best = [0] * length
        for i in range(start, end + 1):
            j = i - start
            take = nums[i] + (best[j - 2] if j >= 2 else 0)
            skip = best[j - 1] if j >= 1 else 0
            best[j] = max(take, skip)
        return best[length - 1]
    return max(robLine(0, n - 2), robLine(1, n - 1))`,
            java: `class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        return Math.max(robLine(nums, 0, n - 2), robLine(nums, 1, n - 1));
    }
    private int robLine(int[] nums, int start, int end) {
        int len = end - start + 1;
        int[] best = new int[len];
        for (int i = start; i <= end; i++) {
            int j = i - start;
            int take = nums[i] + (j >= 2 ? best[j - 2] : 0);
            int skip = j >= 1 ? best[j - 1] : 0;
            best[j] = Math.max(take, skip);
        }
        return best[len - 1];
    }
}`,
            cpp: `int robLine(vector<int>& nums, int start, int end) {
    int len = end - start + 1;
    vector<int> best(len, 0);
    for (int i = start; i <= end; i++) {
        int j = i - start;
        int take = nums[i] + (j >= 2 ? best[j - 2] : 0);
        int skip = j >= 1 ? best[j - 1] : 0;
        best[j] = max(take, skip);
    }
    return best[len - 1];
}
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    return max(robLine(nums, 0, n - 2), robLine(nums, 1, n - 1));
}`,
            c: `int robLine(int *nums, int start, int end) {
    int len = end - start + 1;
    int *best = (int *)calloc(len, sizeof(int));
    int i, ans;
    for (i = start; i <= end; i++) {
        int j = i - start;
        int take = nums[i] + (j >= 2 ? best[j - 2] : 0);
        int skip = j >= 1 ? best[j - 1] : 0;
        best[j] = take > skip ? take : skip;
    }
    ans = best[len - 1];
    free(best);
    return ans;
}
int rob(int *nums, int n) {
    int a, b;
    if (n == 1) return nums[0];
    a = robLine(nums, 0, n - 2);
    b = robLine(nums, 1, n - 1);
    return a > b ? a : b;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "The same two ranges, each robbed with two rolling numbers. Extra memory no longer depends on n. Time is still two linear scans.",
          code: `function rob(nums) {
  const n = nums.length;
  if (n === 1) return nums[0];
  function robLine(start, end) {
    let skip = 0;
    let take = 0;
    for (let i = start; i <= end; i++) {
      const nextTake = skip + nums[i];
      skip = Math.max(skip, take);
      take = nextTake;
    }
    return Math.max(skip, take);
  }
  return Math.max(robLine(0, n - 2), robLine(1, n - 1));
}`,
          codes: {
            javascript: `function rob(nums) {
  const n = nums.length;
  if (n === 1) return nums[0];
  function robLine(start, end) {
    let skip = 0;
    let take = 0;
    for (let i = start; i <= end; i++) {
      const nextTake = skip + nums[i];
      skip = Math.max(skip, take);
      take = nextTake;
    }
    return Math.max(skip, take);
  }
  return Math.max(robLine(0, n - 2), robLine(1, n - 1));
}`,
            python: `def rob(nums):
    n = len(nums)
    if n == 1:
        return nums[0]
    def robLine(start, end):
        skip = 0
        take = 0
        for i in range(start, end + 1):
            nextTake = skip + nums[i]
            skip = max(skip, take)
            take = nextTake
        return max(skip, take)
    return max(robLine(0, n - 2), robLine(1, n - 1))`,
            java: `class Solution {
    public int rob(int[] nums) {
        int n = nums.length;
        if (n == 1) return nums[0];
        return Math.max(robLine(nums, 0, n - 2), robLine(nums, 1, n - 1));
    }
    private int robLine(int[] nums, int start, int end) {
        int skip = 0, take = 0;
        for (int i = start; i <= end; i++) {
            int nextTake = skip + nums[i];
            skip = Math.max(skip, take);
            take = nextTake;
        }
        return Math.max(skip, take);
    }
}`,
            cpp: `int robLine(vector<int>& nums, int start, int end) {
    int skip = 0, take = 0;
    for (int i = start; i <= end; i++) {
        int nextTake = skip + nums[i];
        skip = max(skip, take);
        take = nextTake;
    }
    return max(skip, take);
}
int rob(vector<int>& nums) {
    int n = nums.size();
    if (n == 1) return nums[0];
    return max(robLine(nums, 0, n - 2), robLine(nums, 1, n - 1));
}`,
            c: `int robLine(int *nums, int start, int end) {
    int skip = 0, take = 0, i;
    for (i = start; i <= end; i++) {
        int nextTake = skip + nums[i];
        skip = skip > take ? skip : take;
        take = nextTake;
    }
    return skip > take ? skip : take;
}
int rob(int *nums, int n) {
    int a, b;
    if (n == 1) return nums[0];
    a = robLine(nums, 0, n - 2);
    b = robLine(nums, 1, n - 1);
    return a > b ? a : b;
}`
          }
        }
      ]
    },
    {
      id: 4,
      level: "intermediate",
      q: "Coin Change",
      ask: "Amazon · Google · Microsoft · Apple",
      a: "You have coin values in coins. Each coin may be used any number of times. Return the fewest coins that sum to amount, or -1 if it is impossible.\n\nTiny example: coins = [1, 3, 4], amount = 6. 4+1+1 is three coins, 3+3 is two. Answer 2.\n\nThis is unbounded knapsack for minimum count. A state is remaining amount (or current sum). The transition is: try each coin and add 1.\n\nOpen the Brute, Optimal, and More optimal tabs for raw recursion, a memo on remaining, and a 1D bottom-up row.",
      solutions: [
        {
          name: "Brute",
          time: "O(S^n)",
          space: "O(amount)",
          why: "At every remaining amount you branch on every coin. The tree is huge and repeats the same remain. Depth is at most amount (all 1s). S is amount, n is number of coins.",
          code: `function coinChange(coins, amount) {
  function go(remain) {
    if (remain === 0) return 0;
    if (remain < 0) return Infinity;
    let best = Infinity;
    for (let i = 0; i < coins.length; i++) {
      const used = go(remain - coins[i]);
      if (used !== Infinity) best = Math.min(best, used + 1);
    }
    return best;
  }
  const ans = go(amount);
  return ans === Infinity ? -1 : ans;
}`,
          codes: {
            javascript: `function coinChange(coins, amount) {
  function go(remain) {
    if (remain === 0) return 0;
    if (remain < 0) return Infinity;
    let best = Infinity;
    for (let i = 0; i < coins.length; i++) {
      const used = go(remain - coins[i]);
      if (used !== Infinity) best = Math.min(best, used + 1);
    }
    return best;
  }
  const ans = go(amount);
  return ans === Infinity ? -1 : ans;
}`,
            python: `def coinChange(coins, amount):
    INF = 10 ** 9
    def go(remain):
        if remain == 0:
            return 0
        if remain < 0:
            return INF
        best = INF
        for coin in coins:
            used = go(remain - coin)
            if used != INF:
                best = min(best, used + 1)
        return best
    ans = go(amount)
    return -1 if ans == INF else ans`,
            java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int ans = go(coins, amount);
        return ans >= 1000000000 ? -1 : ans;
    }
    private int go(int[] coins, int remain) {
        if (remain == 0) return 0;
        if (remain < 0) return 1000000000;
        int best = 1000000000;
        for (int i = 0; i < coins.length; i++) {
            int used = go(coins, remain - coins[i]);
            if (used < 1000000000) best = Math.min(best, used + 1);
        }
        return best;
    }
}`,
            cpp: `int coinGo(vector<int>& coins, int remain) {
    const int INF = 1000000000;
    if (remain == 0) return 0;
    if (remain < 0) return INF;
    int best = INF;
    for (int i = 0; i < (int)coins.size(); i++) {
        int used = coinGo(coins, remain - coins[i]);
        if (used != INF) best = min(best, used + 1);
    }
    return best;
}
int coinChange(vector<int>& coins, int amount) {
    int ans = coinGo(coins, amount);
    return ans == 1000000000 ? -1 : ans;
}`,
            c: `int coinGo(int *coins, int n, int remain) {
    const int INF = 1000000000;
    int i, best, used;
    if (remain == 0) return 0;
    if (remain < 0) return INF;
    best = INF;
    for (i = 0; i < n; i++) {
        used = coinGo(coins, n, remain - coins[i]);
        if (used != INF && used + 1 < best) best = used + 1;
    }
    return best;
}
int coinChange(int *coins, int n, int amount) {
    int ans = coinGo(coins, n, amount);
    return ans == 1000000000 ? -1 : ans;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * amount)",
          space: "O(amount)",
          why: "Each remaining amount is solved once. Work per state is a loop over n coins. Memo array is size amount+1. Same recurrence as brute, overlapping calls collapsed.",
          code: `function coinChange(coins, amount) {
  const memo = [];
  function go(remain) {
    if (remain === 0) return 0;
    if (remain < 0) return Infinity;
    if (memo[remain] !== undefined) return memo[remain];
    let best = Infinity;
    for (let i = 0; i < coins.length; i++) {
      const used = go(remain - coins[i]);
      if (used !== Infinity) best = Math.min(best, used + 1);
    }
    memo[remain] = best;
    return best;
  }
  const ans = go(amount);
  return ans === Infinity ? -1 : ans;
}`,
          codes: {
            javascript: `function coinChange(coins, amount) {
  const memo = [];
  function go(remain) {
    if (remain === 0) return 0;
    if (remain < 0) return Infinity;
    if (memo[remain] !== undefined) return memo[remain];
    let best = Infinity;
    for (let i = 0; i < coins.length; i++) {
      const used = go(remain - coins[i]);
      if (used !== Infinity) best = Math.min(best, used + 1);
    }
    memo[remain] = best;
    return best;
  }
  const ans = go(amount);
  return ans === Infinity ? -1 : ans;
}`,
            python: `def coinChange(coins, amount):
    INF = 10 ** 9
    memo = {}
    def go(remain):
        if remain == 0:
            return 0
        if remain < 0:
            return INF
        if remain in memo:
            return memo[remain]
        best = INF
        for coin in coins:
            used = go(remain - coin)
            if used != INF:
                best = min(best, used + 1)
        memo[remain] = best
        return best
    ans = go(amount)
    return -1 if ans == INF else ans`,
            java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        Integer[] memo = new Integer[amount + 1];
        int ans = go(coins, amount, memo);
        return ans >= 1000000000 ? -1 : ans;
    }
    private int go(int[] coins, int remain, Integer[] memo) {
        if (remain == 0) return 0;
        if (remain < 0) return 1000000000;
        if (memo[remain] != null) return memo[remain];
        int best = 1000000000;
        for (int i = 0; i < coins.length; i++) {
            int used = go(coins, remain - coins[i], memo);
            if (used < 1000000000) best = Math.min(best, used + 1);
        }
        memo[remain] = best;
        return best;
    }
}`,
            cpp: `int coinGo(vector<int>& coins, int remain, vector<int>& memo) {
    const int INF = 1000000000;
    if (remain == 0) return 0;
    if (remain < 0) return INF;
    if (memo[remain] != -2) return memo[remain];
    int best = INF;
    for (int i = 0; i < (int)coins.size(); i++) {
        int used = coinGo(coins, remain - coins[i], memo);
        if (used != INF) best = min(best, used + 1);
    }
    memo[remain] = best;
    return best;
}
int coinChange(vector<int>& coins, int amount) {
    vector<int> memo(amount + 1, -2);
    int ans = coinGo(coins, amount, memo);
    return ans == 1000000000 ? -1 : ans;
}`,
            c: `int coinGo(int *coins, int n, int remain, int *memo) {
    const int INF = 1000000000;
    int i, best, used;
    if (remain == 0) return 0;
    if (remain < 0) return INF;
    if (memo[remain] != -2) return memo[remain];
    best = INF;
    for (i = 0; i < n; i++) {
        used = coinGo(coins, n, remain - coins[i], memo);
        if (used != INF && used + 1 < best) best = used + 1;
    }
    memo[remain] = best;
    return best;
}
int coinChange(int *coins, int n, int amount) {
    int *memo = (int *)malloc((amount + 1) * sizeof(int));
    int i, ans;
    for (i = 0; i <= amount; i++) memo[i] = -2;
    ans = coinGo(coins, n, amount, memo);
    free(memo);
    return ans == 1000000000 ? -1 : ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * amount)",
          space: "O(amount)",
          why: "Bottom-up 1D unbounded knapsack. best[s] is fewest coins for sum s. Filling left to right allows reuse. No recursion. Same asymptotics as memo, cleaner order, no stack.",
          code: `function coinChange(coins, amount) {
  const best = Array(amount + 1).fill(Infinity);
  best[0] = 0;
  for (let s = 1; s <= amount; s++) {
    for (let i = 0; i < coins.length; i++) {
      const coin = coins[i];
      if (coin <= s) best[s] = Math.min(best[s], best[s - coin] + 1);
    }
  }
  return best[amount] === Infinity ? -1 : best[amount];
}`,
          codes: {
            javascript: `function coinChange(coins, amount) {
  const best = Array(amount + 1).fill(Infinity);
  best[0] = 0;
  for (let s = 1; s <= amount; s++) {
    for (let i = 0; i < coins.length; i++) {
      const coin = coins[i];
      if (coin <= s) best[s] = Math.min(best[s], best[s - coin] + 1);
    }
  }
  return best[amount] === Infinity ? -1 : best[amount];
}`,
            python: `def coinChange(coins, amount):
    INF = 10 ** 9
    best = [INF] * (amount + 1)
    best[0] = 0
    for s in range(1, amount + 1):
        for coin in coins:
            if coin <= s:
                best[s] = min(best[s], best[s - coin] + 1)
    return -1 if best[amount] == INF else best[amount]`,
            java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        int INF = 1000000000;
        int[] best = new int[amount + 1];
        java.util.Arrays.fill(best, INF);
        best[0] = 0;
        for (int s = 1; s <= amount; s++) {
            for (int i = 0; i < coins.length; i++) {
                int coin = coins[i];
                if (coin <= s) best[s] = Math.min(best[s], best[s - coin] + 1);
            }
        }
        return best[amount] == INF ? -1 : best[amount];
    }
}`,
            cpp: `int coinChange(vector<int>& coins, int amount) {
    const int INF = 1000000000;
    vector<int> best(amount + 1, INF);
    best[0] = 0;
    for (int s = 1; s <= amount; s++) {
        for (int i = 0; i < (int)coins.size(); i++) {
            int coin = coins[i];
            if (coin <= s) best[s] = min(best[s], best[s - coin] + 1);
        }
    }
    return best[amount] == INF ? -1 : best[amount];
}`,
            c: `int coinChange(int *coins, int n, int amount) {
    const int INF = 1000000000;
    int *best = (int *)malloc((amount + 1) * sizeof(int));
    int s, i, ans;
    for (s = 0; s <= amount; s++) best[s] = INF;
    best[0] = 0;
    for (s = 1; s <= amount; s++) {
        for (i = 0; i < n; i++) {
            int coin = coins[i];
            if (coin <= s && best[s - coin] + 1 < best[s]) {
                best[s] = best[s - coin] + 1;
            }
        }
    }
    ans = best[amount] == INF ? -1 : best[amount];
    free(best);
    return ans;
}`
          }
        }
      ]
    },
    {
      id: 5,
      level: "intermediate",
      q: "Longest Increasing Subsequence",
      ask: "Google · Amazon · Microsoft · Meta",
      a: "A subsequence keeps order but may skip indexes. Strictly increasing means each chosen number is larger than the last. Return the length of the longest increasing subsequence.\n\nTiny example: [10, 9, 2, 5, 3, 7, 101, 18]. One LIS is 2, 5, 7, 101 (length 4). 2, 3, 7, 18 is another length 4.\n\nThe O(n^2) state is “LIS ending at i.” You extend any earlier j with nums[j] < nums[i]. The O(n log n) idea keeps the smallest tail for every length and binary-searches the first tail that is not smaller than the new number.\n\nOpen the Brute, Optimal, and More optimal tabs for take/skip recursion, the n^2 table, and the tails binary search.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n)",
          space: "O(n)",
          why: "At each index you take (if it is larger than prev) or skip. No cache, so every subset of positions is explored. Depth is n.",
          code: `function lengthOfLIS(nums) {
  function go(i, prev) {
    if (i === nums.length) return 0;
    const skip = go(i + 1, prev);
    let take = 0;
    if (prev === -1 || nums[i] > nums[prev]) {
      take = 1 + go(i + 1, i);
    }
    return Math.max(skip, take);
  }
  return go(0, -1);
}`,
          codes: {
            javascript: `function lengthOfLIS(nums) {
  function go(i, prev) {
    if (i === nums.length) return 0;
    const skip = go(i + 1, prev);
    let take = 0;
    if (prev === -1 || nums[i] > nums[prev]) {
      take = 1 + go(i + 1, i);
    }
    return Math.max(skip, take);
  }
  return go(0, -1);
}`,
            python: `def lengthOfLIS(nums):
    def go(i, prev):
        if i == len(nums):
            return 0
        skip = go(i + 1, prev)
        take = 0
        if prev == -1 or nums[i] > nums[prev]:
            take = 1 + go(i + 1, i)
        return max(skip, take)
    return go(0, -1)`,
            java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        return go(nums, 0, -1);
    }
    private int go(int[] nums, int i, int prev) {
        if (i == nums.length) return 0;
        int skip = go(nums, i + 1, prev);
        int take = 0;
        if (prev == -1 || nums[i] > nums[prev]) {
            take = 1 + go(nums, i + 1, i);
        }
        return Math.max(skip, take);
    }
}`,
            cpp: `int lisGo(vector<int>& nums, int i, int prev) {
    if (i == (int)nums.size()) return 0;
    int skip = lisGo(nums, i + 1, prev);
    int take = 0;
    if (prev == -1 || nums[i] > nums[prev]) {
        take = 1 + lisGo(nums, i + 1, i);
    }
    return max(skip, take);
}
int lengthOfLIS(vector<int>& nums) {
    return lisGo(nums, 0, -1);
}`,
            c: `int lisGo(int *nums, int n, int i, int prev) {
    int skip, take = 0;
    if (i == n) return 0;
    skip = lisGo(nums, n, i + 1, prev);
    if (prev == -1 || nums[i] > nums[prev]) {
        take = 1 + lisGo(nums, n, i + 1, i);
    }
    return skip > take ? skip : take;
}
int lengthOfLIS(int *nums, int n) {
    return lisGo(nums, n, 0, -1);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n^2)",
          space: "O(n)",
          why: "len[i] is the longest increasing subsequence that ends at i. Each pair (j, i) with j < i is checked once. n^2 states of work, one array of n cells. Standard interview DP.",
          code: `function lengthOfLIS(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  const len = Array(n).fill(1);
  let best = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        len[i] = Math.max(len[i], len[j] + 1);
      }
    }
    best = Math.max(best, len[i]);
  }
  return best;
}`,
          codes: {
            javascript: `function lengthOfLIS(nums) {
  const n = nums.length;
  if (n === 0) return 0;
  const len = Array(n).fill(1);
  let best = 1;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (nums[j] < nums[i]) {
        len[i] = Math.max(len[i], len[j] + 1);
      }
    }
    best = Math.max(best, len[i]);
  }
  return best;
}`,
            python: `def lengthOfLIS(nums):
    n = len(nums)
    if n == 0:
        return 0
    length = [1] * n
    best = 1
    for i in range(n):
        for j in range(i):
            if nums[j] < nums[i]:
                length[i] = max(length[i], length[j] + 1)
        best = max(best, length[i])
    return best`,
            java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int n = nums.length;
        if (n == 0) return 0;
        int[] len = new int[n];
        java.util.Arrays.fill(len, 1);
        int best = 1;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < i; j++) {
                if (nums[j] < nums[i]) {
                    len[i] = Math.max(len[i], len[j] + 1);
                }
            }
            best = Math.max(best, len[i]);
        }
        return best;
    }
}`,
            cpp: `int lengthOfLIS(vector<int>& nums) {
    int n = nums.size();
    if (n == 0) return 0;
    vector<int> len(n, 1);
    int best = 1;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) len[i] = max(len[i], len[j] + 1);
        }
        best = max(best, len[i]);
    }
    return best;
}`,
            c: `int lengthOfLIS(int *nums, int n) {
    int *len, i, j, best, ans;
    if (n == 0) return 0;
    len = (int *)malloc(n * sizeof(int));
    for (i = 0; i < n; i++) len[i] = 1;
    best = 1;
    for (i = 0; i < n; i++) {
        for (j = 0; j < i; j++) {
            if (nums[j] < nums[i] && len[j] + 1 > len[i]) len[i] = len[j] + 1;
        }
        if (len[i] > best) best = len[i];
    }
    ans = best;
    free(len);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "tails[k] is the smallest tail of all increasing subsequences of length k+1. For each number, binary search the first tail that is >= num and replace it (or append). Length of tails is the LIS length. Tails is not the LIS itself.",
          code: `function lengthOfLIS(nums) {
  const tails = [];
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    let left = 0;
    let right = tails.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) left = mid + 1;
      else right = mid;
    }
    if (left === tails.length) tails.push(num);
    else tails[left] = num;
  }
  return tails.length;
}`,
          codes: {
            javascript: `function lengthOfLIS(nums) {
  const tails = [];
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    let left = 0;
    let right = tails.length;
    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      if (tails[mid] < num) left = mid + 1;
      else right = mid;
    }
    if (left === tails.length) tails.push(num);
    else tails[left] = num;
  }
  return tails.length;
}`,
            python: `def lengthOfLIS(nums):
    tails = []
    for num in nums:
        left, right = 0, len(tails)
        while left < right:
            mid = (left + right) // 2
            if tails[mid] < num:
                left = mid + 1
            else:
                right = mid
        if left == len(tails):
            tails.append(num)
        else:
            tails[left] = num
    return len(tails)`,
            java: `class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];
            int left = 0, right = size;
            while (left < right) {
                int mid = (left + right) / 2;
                if (tails[mid] < num) left = mid + 1;
                else right = mid;
            }
            if (left == size) tails[size++] = num;
            else tails[left] = num;
        }
        return size;
    }
}`,
            cpp: `int lengthOfLIS(vector<int>& nums) {
    vector<int> tails;
    for (int i = 0; i < (int)nums.size(); i++) {
        int num = nums[i];
        int left = 0, right = (int)tails.size();
        while (left < right) {
            int mid = (left + right) / 2;
            if (tails[mid] < num) left = mid + 1;
            else right = mid;
        }
        if (left == (int)tails.size()) tails.push_back(num);
        else tails[left] = num;
    }
    return (int)tails.size();
}`,
            c: `int lengthOfLIS(int *nums, int n) {
    int *tails = (int *)malloc(n * sizeof(int));
    int size = 0, i;
    for (i = 0; i < n; i++) {
        int num = nums[i];
        int left = 0, right = size;
        while (left < right) {
            int mid = (left + right) / 2;
            if (tails[mid] < num) left = mid + 1;
            else right = mid;
        }
        if (left == size) tails[size++] = num;
        else tails[left] = num;
    }
    free(tails);
    return size;
}`
          }
        }
      ]
    },
    {
      id: 6,
      level: "intermediate",
      q: "Longest Common Subsequence",
      ask: "Amazon · Google · Microsoft",
      a: "Given two strings, return the length of the longest subsequence that appears in both. Order stays; you may skip letters in either string.\n\nTiny example: text1 = \"abcde\", text2 = \"ace\". The letters a, c, e appear in both in that order. Answer 3.\n\nIf the current letters match, you take 1 + LCS of the rest. If they differ, you drop a letter from the first string or from the second and take the max. Empty prefix has LCS 0.\n\nOpen the Brute, Optimal, and More optimal tabs for recursion, the (m+1) by (n+1) table, and a rolling row.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^{m+n})",
          space: "O(m + n)",
          why: "Mismatch branches into two calls. Matching still walks both strings. Overlapping (i, j) pairs are recomputed. Stack is O(m+n).",
          code: `function longestCommonSubsequence(text1, text2) {
  function go(i, j) {
    if (i === text1.length || j === text2.length) return 0;
    if (text1[i] === text2[j]) return 1 + go(i + 1, j + 1);
    return Math.max(go(i + 1, j), go(i, j + 1));
  }
  return go(0, 0);
}`,
          codes: {
            javascript: `function longestCommonSubsequence(text1, text2) {
  function go(i, j) {
    if (i === text1.length || j === text2.length) return 0;
    if (text1[i] === text2[j]) return 1 + go(i + 1, j + 1);
    return Math.max(go(i + 1, j), go(i, j + 1));
  }
  return go(0, 0);
}`,
            python: `def longestCommonSubsequence(text1, text2):
    def go(i, j):
        if i == len(text1) or j == len(text2):
            return 0
        if text1[i] == text2[j]:
            return 1 + go(i + 1, j + 1)
        return max(go(i + 1, j), go(i, j + 1))
    return go(0, 0)`,
            java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        return go(text1, text2, 0, 0);
    }
    private int go(String text1, String text2, int i, int j) {
        if (i == text1.length() || j == text2.length()) return 0;
        if (text1.charAt(i) == text2.charAt(j)) return 1 + go(text1, text2, i + 1, j + 1);
        return Math.max(go(text1, text2, i + 1, j), go(text1, text2, i, j + 1));
    }
}`,
            cpp: `int lcsGo(const string& text1, const string& text2, int i, int j) {
    if (i == (int)text1.size() || j == (int)text2.size()) return 0;
    if (text1[i] == text2[j]) return 1 + lcsGo(text1, text2, i + 1, j + 1);
    return max(lcsGo(text1, text2, i + 1, j), lcsGo(text1, text2, i, j + 1));
}
int longestCommonSubsequence(string text1, string text2) {
    return lcsGo(text1, text2, 0, 0);
}`,
            c: `int lcsGo(const char *text1, const char *text2, int i, int j) {
    if (text1[i] == 0 || text2[j] == 0) return 0;
    if (text1[i] == text2[j]) return 1 + lcsGo(text1, text2, i + 1, j + 1);
    int a = lcsGo(text1, text2, i + 1, j);
    int b = lcsGo(text1, text2, i, j + 1);
    return a > b ? a : b;
}
int longestCommonSubsequence(const char *text1, const char *text2) {
    return lcsGo(text1, text2, 0, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(m * n)",
          space: "O(m * n)",
          why: "One cell per prefix pair. Each cell is O(1) work from three neighbors. The full grid makes the recurrence obvious and is what you draw on a whiteboard.",
          code: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, function () {
    return Array(n + 1).fill(0);
  });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
          codes: {
            javascript: `function longestCommonSubsequence(text1, text2) {
  const m = text1.length;
  const n = text2.length;
  const dp = Array.from({ length: m + 1 }, function () {
    return Array(n + 1).fill(0);
  });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
            python: `def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]`,
            java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        int m = text1.length(), n = text2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        return dp[m][n];
    }
}`,
            cpp: `int longestCommonSubsequence(string text1, string text2) {
    int m = text1.size(), n = text2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        }
    }
    return dp[m][n];
}`,
            c: `int longestCommonSubsequence(const char *text1, const char *text2) {
    int m = (int)strlen(text1), n = (int)strlen(text2);
    int **dp = (int **)malloc((m + 1) * sizeof(int *));
    int i, j, ans;
    for (i = 0; i <= m; i++) dp[i] = (int *)calloc(n + 1, sizeof(int));
    for (i = 1; i <= m; i++) {
        for (j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
            else dp[i][j] = dp[i - 1][j] > dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];
        }
    }
    ans = dp[m][n];
    for (i = 0; i <= m; i++) free(dp[i]);
    free(dp);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(m * n)",
          space: "O(min(m, n))",
          why: "A cell only needs the previous row. Keep prev and cur. Swap the shorter string onto the row so extra memory is the smaller length. Time is still every pair of letters.",
          code: `function longestCommonSubsequence(text1, text2) {
  if (text1.length < text2.length) {
    const tmp = text1;
    text1 = text2;
    text2 = tmp;
  }
  const n = text2.length;
  let prev = Array(n + 1).fill(0);
  for (let i = 1; i <= text1.length; i++) {
    const cur = Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) cur[j] = prev[j - 1] + 1;
      else cur[j] = Math.max(prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[n];
}`,
          codes: {
            javascript: `function longestCommonSubsequence(text1, text2) {
  if (text1.length < text2.length) {
    const tmp = text1;
    text1 = text2;
    text2 = tmp;
  }
  const n = text2.length;
  let prev = Array(n + 1).fill(0);
  for (let i = 1; i <= text1.length; i++) {
    const cur = Array(n + 1).fill(0);
    for (let j = 1; j <= n; j++) {
      if (text1[i - 1] === text2[j - 1]) cur[j] = prev[j - 1] + 1;
      else cur[j] = Math.max(prev[j], cur[j - 1]);
    }
    prev = cur;
  }
  return prev[n];
}`,
            python: `def longestCommonSubsequence(text1, text2):
    if len(text1) < len(text2):
        text1, text2 = text2, text1
    n = len(text2)
    prev = [0] * (n + 1)
    for i in range(1, len(text1) + 1):
        cur = [0] * (n + 1)
        for j in range(1, n + 1):
            if text1[i - 1] == text2[j - 1]:
                cur[j] = prev[j - 1] + 1
            else:
                cur[j] = max(prev[j], cur[j - 1])
        prev = cur
    return prev[n]`,
            java: `class Solution {
    public int longestCommonSubsequence(String text1, String text2) {
        if (text1.length() < text2.length()) {
            String tmp = text1;
            text1 = text2;
            text2 = tmp;
        }
        int n = text2.length();
        int[] prev = new int[n + 1];
        for (int i = 1; i <= text1.length(); i++) {
            int[] cur = new int[n + 1];
            for (int j = 1; j <= n; j++) {
                if (text1.charAt(i - 1) == text2.charAt(j - 1)) cur[j] = prev[j - 1] + 1;
                else cur[j] = Math.max(prev[j], cur[j - 1]);
            }
            prev = cur;
        }
        return prev[n];
    }
}`,
            cpp: `int longestCommonSubsequence(string text1, string text2) {
    if (text1.size() < text2.size()) swap(text1, text2);
    int n = text2.size();
    vector<int> prev(n + 1, 0);
    for (int i = 1; i <= (int)text1.size(); i++) {
        vector<int> cur(n + 1, 0);
        for (int j = 1; j <= n; j++) {
            if (text1[i - 1] == text2[j - 1]) cur[j] = prev[j - 1] + 1;
            else cur[j] = max(prev[j], cur[j - 1]);
        }
        prev.swap(cur);
    }
    return prev[n];
}`,
            c: `int longestCommonSubsequence(const char *text1, const char *text2) {
    int m = (int)strlen(text1), n = (int)strlen(text2);
    const char *a = text1, *b = text2;
    int *prev, *cur, i, j, t, ans;
    if (m < n) { a = text2; b = text1; t = m; m = n; n = t; }
    prev = (int *)calloc(n + 1, sizeof(int));
    for (i = 1; i <= m; i++) {
        cur = (int *)calloc(n + 1, sizeof(int));
        for (j = 1; j <= n; j++) {
            if (a[i - 1] == b[j - 1]) cur[j] = prev[j - 1] + 1;
            else cur[j] = prev[j] > cur[j - 1] ? prev[j] : cur[j - 1];
        }
        free(prev);
        prev = cur;
    }
    ans = prev[n];
    free(prev);
    return ans;
}`
          }
        }
      ]
    },
    {
      id: 7,
      level: "intermediate",
      q: "Word Break",
      ask: "Amazon · Google · Meta · Apple",
      a: "You are given a string s and a list of words. Return true if s can be split into a sequence of those words. Words may be reused. Order in the dictionary does not matter.\n\nTiny example: s = \"applepenapple\", wordDict = [\"apple\", \"pen\"]. apple + pen + apple works. Answer true. \"catsandog\" with [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"] cannot finish. Answer false.\n\nA state is the start index i. If any dictionary word matches s starting at i and the rest also breaks, i is good. The boolean row can[i] means s[0..i) can be segmented.\n\nOpen the Brute, Optimal, and More optimal tabs for prefix recursion, memo on the start index, and the boolean DP row.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n)",
          space: "O(n)",
          why: "Every start tries every word. Failed prefixes are retried from overlapping indexes. Worst case is exponential in n. Stack is O(n).",
          code: `function wordBreak(s, wordDict) {
  function go(i) {
    if (i === s.length) return true;
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.startsWith(word, i) && go(i + word.length)) return true;
    }
    return false;
  }
  return go(0);
}`,
          codes: {
            javascript: `function wordBreak(s, wordDict) {
  function go(i) {
    if (i === s.length) return true;
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.startsWith(word, i) && go(i + word.length)) return true;
    }
    return false;
  }
  return go(0);
}`,
            python: `def wordBreak(s, wordDict):
    def go(i):
        if i == len(s):
            return True
        for word in wordDict:
            if s.startswith(word, i) and go(i + len(word)):
                return True
        return False
    return go(0)`,
            java: `class Solution {
    public boolean wordBreak(String s, String[] wordDict) {
        return go(s, wordDict, 0);
    }
    private boolean go(String s, String[] wordDict, int i) {
        if (i == s.length()) return true;
        for (int w = 0; w < wordDict.length; w++) {
            String word = wordDict[w];
            if (s.startsWith(word, i) && go(s, wordDict, i + word.length())) return true;
        }
        return false;
    }
}`,
            cpp: `bool wordGo(const string& s, vector<string>& wordDict, int i) {
    if (i == (int)s.size()) return true;
    for (int w = 0; w < (int)wordDict.size(); w++) {
        const string& word = wordDict[w];
        if (s.compare(i, word.size(), word) == 0 && wordGo(s, wordDict, i + (int)word.size())) {
            return true;
        }
    }
    return false;
}
bool wordBreak(string s, vector<string>& wordDict) {
    return wordGo(s, wordDict, 0);
}`,
            c: `int startsAt(const char *s, int i, const char *word) {
    int k = 0;
    while (word[k]) {
        if (s[i + k] != word[k]) return 0;
        k++;
    }
    return 1;
}
int wordGo(const char *s, char **wordDict, int m, int i) {
    int w, len;
    if (s[i] == 0) return 1;
    for (w = 0; w < m; w++) {
        len = (int)strlen(wordDict[w]);
        if (startsAt(s, i, wordDict[w]) && wordGo(s, wordDict, m, i + len)) return 1;
    }
    return 0;
}
int wordBreak(const char *s, char **wordDict, int m) {
    return wordGo(s, wordDict, m, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * m * L)",
          space: "O(n)",
          why: "Each start index i is solved once. Per index you try m words, each startsWith costs up to L. Memo of n booleans. n is s.length, m is dict size, L is max word length.",
          code: `function wordBreak(s, wordDict) {
  const memo = [];
  function go(i) {
    if (i === s.length) return true;
    if (memo[i] !== undefined) return memo[i];
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.startsWith(word, i) && go(i + word.length)) {
        memo[i] = true;
        return true;
      }
    }
    memo[i] = false;
    return false;
  }
  return go(0);
}`,
          codes: {
            javascript: `function wordBreak(s, wordDict) {
  const memo = [];
  function go(i) {
    if (i === s.length) return true;
    if (memo[i] !== undefined) return memo[i];
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.startsWith(word, i) && go(i + word.length)) {
        memo[i] = true;
        return true;
      }
    }
    memo[i] = false;
    return false;
  }
  return go(0);
}`,
            python: `def wordBreak(s, wordDict):
    memo = {}
    def go(i):
        if i == len(s):
            return True
        if i in memo:
            return memo[i]
        for word in wordDict:
            if s.startswith(word, i) and go(i + len(word)):
                memo[i] = True
                return True
        memo[i] = False
        return False
    return go(0)`,
            java: `class Solution {
    public boolean wordBreak(String s, String[] wordDict) {
        Boolean[] memo = new Boolean[s.length()];
        return go(s, wordDict, 0, memo);
    }
    private boolean go(String s, String[] wordDict, int i, Boolean[] memo) {
        if (i == s.length()) return true;
        if (memo[i] != null) return memo[i];
        for (int w = 0; w < wordDict.length; w++) {
            String word = wordDict[w];
            if (s.startsWith(word, i) && go(s, wordDict, i + word.length(), memo)) {
                memo[i] = true;
                return true;
            }
        }
        memo[i] = false;
        return false;
    }
}`,
            cpp: `bool wordGo(const string& s, vector<string>& wordDict, int i, vector<int>& memo) {
    if (i == (int)s.size()) return true;
    if (memo[i] != -1) return memo[i];
    for (int w = 0; w < (int)wordDict.size(); w++) {
        const string& word = wordDict[w];
        if (s.compare(i, word.size(), word) == 0 && wordGo(s, wordDict, i + (int)word.size(), memo)) {
            memo[i] = 1;
            return true;
        }
    }
    memo[i] = 0;
    return false;
}
bool wordBreak(string s, vector<string>& wordDict) {
    vector<int> memo(s.size(), -1);
    return wordGo(s, wordDict, 0, memo);
}`,
            c: `int startsAt(const char *s, int i, const char *word) {
    int k = 0;
    while (word[k]) {
        if (s[i + k] != word[k]) return 0;
        k++;
    }
    return 1;
}
int wordGo(const char *s, char **wordDict, int m, int i, int *memo) {
    int w, len;
    if (s[i] == 0) return 1;
    if (memo[i] != -1) return memo[i];
    for (w = 0; w < m; w++) {
        len = (int)strlen(wordDict[w]);
        if (startsAt(s, i, wordDict[w]) && wordGo(s, wordDict, m, i + len, memo)) {
            memo[i] = 1;
            return 1;
        }
    }
    memo[i] = 0;
    return 0;
}
int wordBreak(const char *s, char **wordDict, int m) {
    int n = (int)strlen(s);
    int *memo = (int *)malloc(n * sizeof(int));
    int i, ans;
    for (i = 0; i < n; i++) memo[i] = -1;
    ans = wordGo(s, wordDict, m, 0, memo);
    free(memo);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * m * L)",
          space: "O(n + m)",
          why: "Bottom-up: can[0] is true. From every true cut, stamp every word that matches. A Set makes membership obvious if you later scan splits by length. No recursion; same polynomial bound.",
          code: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const n = s.length;
  const can = Array(n + 1).fill(false);
  can[0] = true;
  for (let i = 0; i < n; i++) {
    if (!can[i]) continue;
    words.forEach(function (word) {
      if (s.startsWith(word, i)) can[i + word.length] = true;
    });
  }
  return can[n];
}`,
          codes: {
            javascript: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const n = s.length;
  const can = Array(n + 1).fill(false);
  can[0] = true;
  for (let i = 0; i < n; i++) {
    if (!can[i]) continue;
    words.forEach(function (word) {
      if (s.startsWith(word, i)) can[i + word.length] = true;
    });
  }
  return can[n];
}`,
            python: `def wordBreak(s, wordDict):
    words = set(wordDict)
    n = len(s)
    can = [False] * (n + 1)
    can[0] = True
    for i in range(n):
        if not can[i]:
            continue
        for word in words:
            if s.startswith(word, i):
                can[i + len(word)] = True
    return can[n]`,
            java: `class Solution {
    public boolean wordBreak(String s, String[] wordDict) {
        java.util.HashSet<String> words = new java.util.HashSet<String>();
        for (int w = 0; w < wordDict.length; w++) words.add(wordDict[w]);
        int n = s.length();
        boolean[] can = new boolean[n + 1];
        can[0] = true;
        for (int i = 0; i < n; i++) {
            if (!can[i]) continue;
            for (String word : words) {
                if (s.startsWith(word, i)) can[i + word.length()] = true;
            }
        }
        return can[n];
    }
}`,
            cpp: `bool wordBreak(string s, vector<string>& wordDict) {
    unordered_set<string> words(wordDict.begin(), wordDict.end());
    int n = s.size();
    vector<char> can(n + 1, 0);
    can[0] = 1;
    for (int i = 0; i < n; i++) {
        if (!can[i]) continue;
        for (const string& word : words) {
            if (s.compare(i, word.size(), word) == 0) can[i + (int)word.size()] = 1;
        }
    }
    return can[n];
}`,
            c: `int startsAt(const char *s, int i, const char *word) {
    int k = 0;
    while (word[k]) {
        if (s[i + k] != word[k]) return 0;
        k++;
    }
    return 1;
}
int wordBreak(const char *s, char **wordDict, int m) {
    int n = (int)strlen(s);
    int *can = (int *)calloc(n + 1, sizeof(int));
    int i, w, ans;
    can[0] = 1;
    for (i = 0; i < n; i++) {
        if (!can[i]) continue;
        for (w = 0; w < m; w++) {
            int len = (int)strlen(wordDict[w]);
            if (startsAt(s, i, wordDict[w])) can[i + len] = 1;
        }
    }
    ans = can[n];
    free(can);
    return ans;
}`
          }
        }
      ]
    },
    {
      id: 8,
      level: "beginner",
      q: "Unique Paths",
      ask: "Google · Amazon · Microsoft",
      a: "A robot starts at the top-left of an m by n grid. It may move only right or down. Return how many paths reach the bottom-right.\n\nTiny example: m = 3, n = 2. Paths: down-down-right, down-right-down, right-down-down. Answer 3.\n\nA cell is reached from above or from the left, so ways[r][c] = ways[r-1][c] + ways[r][c-1]. The first row and first column are 1.\n\nOpen the Brute, Optimal, and More optimal tabs for recursion on (r, c), the 2D grid, and one rolling row.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^{m+n})",
          space: "O(m + n)",
          why: "Each cell branches right and down. Paths share prefixes but nothing is cached. Depth is m+n-2 moves. Fine only for tiny grids.",
          code: `function uniquePaths(m, n) {
  function go(r, c) {
    if (r === m - 1 && c === n - 1) return 1;
    if (r >= m || c >= n) return 0;
    return go(r + 1, c) + go(r, c + 1);
  }
  return go(0, 0);
}`,
          codes: {
            javascript: `function uniquePaths(m, n) {
  function go(r, c) {
    if (r === m - 1 && c === n - 1) return 1;
    if (r >= m || c >= n) return 0;
    return go(r + 1, c) + go(r, c + 1);
  }
  return go(0, 0);
}`,
            python: `def uniquePaths(m, n):
    def go(r, c):
        if r == m - 1 and c == n - 1:
            return 1
        if r >= m or c >= n:
            return 0
        return go(r + 1, c) + go(r, c + 1)
    return go(0, 0)`,
            java: `class Solution {
    public int uniquePaths(int m, int n) {
        return go(m, n, 0, 0);
    }
    private int go(int m, int n, int r, int c) {
        if (r == m - 1 && c == n - 1) return 1;
        if (r >= m || c >= n) return 0;
        return go(m, n, r + 1, c) + go(m, n, r, c + 1);
    }
}`,
            cpp: `int pathsGo(int m, int n, int r, int c) {
    if (r == m - 1 && c == n - 1) return 1;
    if (r >= m || c >= n) return 0;
    return pathsGo(m, n, r + 1, c) + pathsGo(m, n, r, c + 1);
}
int uniquePaths(int m, int n) {
    return pathsGo(m, n, 0, 0);
}`,
            c: `int pathsGo(int m, int n, int r, int c) {
    if (r == m - 1 && c == n - 1) return 1;
    if (r >= m || c >= n) return 0;
    return pathsGo(m, n, r + 1, c) + pathsGo(m, n, r, c + 1);
}
int uniquePaths(int m, int n) {
    return pathsGo(m, n, 0, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(m * n)",
          space: "O(m * n)",
          why: "One cell per grid square, filled from two neighbors in O(1). First row and column are the corridor of 1s. This is the table you draw in an interview.",
          code: `function uniquePaths(m, n) {
  const ways = Array.from({ length: m }, function () {
    return Array(n).fill(0);
  });
  for (let r = 0; r < m; r++) ways[r][0] = 1;
  for (let c = 0; c < n; c++) ways[0][c] = 1;
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
    }
  }
  return ways[m - 1][n - 1];
}`,
          codes: {
            javascript: `function uniquePaths(m, n) {
  const ways = Array.from({ length: m }, function () {
    return Array(n).fill(0);
  });
  for (let r = 0; r < m; r++) ways[r][0] = 1;
  for (let c = 0; c < n; c++) ways[0][c] = 1;
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
    }
  }
  return ways[m - 1][n - 1];
}`,
            python: `def uniquePaths(m, n):
    ways = [[0] * n for _ in range(m)]
    for r in range(m):
        ways[r][0] = 1
    for c in range(n):
        ways[0][c] = 1
    for r in range(1, m):
        for c in range(1, n):
            ways[r][c] = ways[r - 1][c] + ways[r][c - 1]
    return ways[m - 1][n - 1]`,
            java: `class Solution {
    public int uniquePaths(int m, int n) {
        int[][] ways = new int[m][n];
        for (int r = 0; r < m; r++) ways[r][0] = 1;
        for (int c = 0; c < n; c++) ways[0][c] = 1;
        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) {
                ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
            }
        }
        return ways[m - 1][n - 1];
    }
}`,
            cpp: `int uniquePaths(int m, int n) {
    vector<vector<int>> ways(m, vector<int>(n, 0));
    for (int r = 0; r < m; r++) ways[r][0] = 1;
    for (int c = 0; c < n; c++) ways[0][c] = 1;
    for (int r = 1; r < m; r++) {
        for (int c = 1; c < n; c++) {
            ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
        }
    }
    return ways[m - 1][n - 1];
}`,
            c: `int uniquePaths(int m, int n) {
    int **ways = (int **)malloc(m * sizeof(int *));
    int r, c, ans;
    for (r = 0; r < m; r++) ways[r] = (int *)calloc(n, sizeof(int));
    for (r = 0; r < m; r++) ways[r][0] = 1;
    for (c = 0; c < n; c++) ways[0][c] = 1;
    for (r = 1; r < m; r++) {
        for (c = 1; c < n; c++) {
            ways[r][c] = ways[r - 1][c] + ways[r][c - 1];
        }
    }
    ans = ways[m - 1][n - 1];
    for (r = 0; r < m; r++) free(ways[r]);
    free(ways);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(m * n)",
          space: "O(n)",
          why: "A cell only needs the previous row. One row: ways[c] is “from above” before you add ways[c-1] (from the left). Extra memory is one row of width n.",
          code: `function uniquePaths(m, n) {
  const ways = Array(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      ways[c] += ways[c - 1];
    }
  }
  return ways[n - 1];
}`,
          codes: {
            javascript: `function uniquePaths(m, n) {
  const ways = Array(n).fill(1);
  for (let r = 1; r < m; r++) {
    for (let c = 1; c < n; c++) {
      ways[c] += ways[c - 1];
    }
  }
  return ways[n - 1];
}`,
            python: `def uniquePaths(m, n):
    ways = [1] * n
    for r in range(1, m):
        for c in range(1, n):
            ways[c] += ways[c - 1]
    return ways[n - 1]`,
            java: `class Solution {
    public int uniquePaths(int m, int n) {
        int[] ways = new int[n];
        java.util.Arrays.fill(ways, 1);
        for (int r = 1; r < m; r++) {
            for (int c = 1; c < n; c++) {
                ways[c] += ways[c - 1];
            }
        }
        return ways[n - 1];
    }
}`,
            cpp: `int uniquePaths(int m, int n) {
    vector<int> ways(n, 1);
    for (int r = 1; r < m; r++) {
        for (int c = 1; c < n; c++) {
            ways[c] += ways[c - 1];
        }
    }
    return ways[n - 1];
}`,
            c: `int uniquePaths(int m, int n) {
    int *ways = (int *)malloc(n * sizeof(int));
    int r, c, ans;
    for (c = 0; c < n; c++) ways[c] = 1;
    for (r = 1; r < m; r++) {
        for (c = 1; c < n; c++) {
            ways[c] += ways[c - 1];
        }
    }
    ans = ways[n - 1];
    free(ways);
    return ans;
}`
          }
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "Unique Paths II",
      ask: "Amazon · Google · Apple",
      a: "Same grid as Unique Paths, but some cells hold a 1 (a stone). You cannot walk on a stone. Return the number of paths from top-left to bottom-right. If the start is a stone, the answer is 0.\n\nTiny example: [[0,0,0],[0,1,0],[0,0,0]]. The middle cell is blocked. Two paths remain. Answer 2.\n\nA stone zeros that cell. Other cells still add from above and left. The 1D row overwrites a blocked column with 0 so later cells in that row cannot pick a fake left path.\n\nOpen the Brute, Optimal, and More optimal tabs for recursion that rejects stones, a 2D ways grid, and the 1D row.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^{m+n})",
          space: "O(m + n)",
          why: "Same path tree as Unique Paths, with extra dead ends on stones. No cache, so overlapping cells are walked many times.",
          code: `function uniquePathsWithObstacles(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  function go(r, c) {
    if (r >= rows || c >= cols || grid[r][c] === 1) return 0;
    if (r === rows - 1 && c === cols - 1) return 1;
    return go(r + 1, c) + go(r, c + 1);
  }
  return go(0, 0);
}`,
          codes: {
            javascript: `function uniquePathsWithObstacles(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  function go(r, c) {
    if (r >= rows || c >= cols || grid[r][c] === 1) return 0;
    if (r === rows - 1 && c === cols - 1) return 1;
    return go(r + 1, c) + go(r, c + 1);
  }
  return go(0, 0);
}`,
            python: `def uniquePathsWithObstacles(grid):
    rows, cols = len(grid), len(grid[0])
    def go(r, c):
        if r >= rows or c >= cols or grid[r][c] == 1:
            return 0
        if r == rows - 1 and c == cols - 1:
            return 1
        return go(r + 1, c) + go(r, c + 1)
    return go(0, 0)`,
            java: `class Solution {
    public int uniquePathsWithObstacles(int[][] grid) {
        return go(grid, 0, 0);
    }
    private int go(int[][] grid, int r, int c) {
        int rows = grid.length, cols = grid[0].length;
        if (r >= rows || c >= cols || grid[r][c] == 1) return 0;
        if (r == rows - 1 && c == cols - 1) return 1;
        return go(grid, r + 1, c) + go(grid, r, c + 1);
    }
}`,
            cpp: `int obsGo(vector<vector<int>>& grid, int r, int c) {
    int rows = grid.size(), cols = grid[0].size();
    if (r >= rows || c >= cols || grid[r][c] == 1) return 0;
    if (r == rows - 1 && c == cols - 1) return 1;
    return obsGo(grid, r + 1, c) + obsGo(grid, r, c + 1);
}
int uniquePathsWithObstacles(vector<vector<int>>& grid) {
    return obsGo(grid, 0, 0);
}`,
            c: `int obsGo(int **grid, int rows, int cols, int r, int c) {
    if (r >= rows || c >= cols || grid[r][c] == 1) return 0;
    if (r == rows - 1 && c == cols - 1) return 1;
    return obsGo(grid, rows, cols, r + 1, c) + obsGo(grid, rows, cols, r, c + 1);
}
int uniquePathsWithObstacles(int **grid, int rows, int cols) {
    return obsGo(grid, rows, cols, 0, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(m * n)",
          space: "O(m * n)",
          why: "Each cell is filled once. Stones store 0. Start is 1 only if it is free. Neighbors that do not exist contribute 0. Classic 2D DP on a grid.",
          code: `function uniquePathsWithObstacles(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  if (grid[0][0] === 1) return 0;
  const ways = Array.from({ length: rows }, function () {
    return Array(cols).fill(0);
  });
  ways[0][0] = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        ways[r][c] = 0;
        continue;
      }
      if (r === 0 && c === 0) continue;
      const up = r > 0 ? ways[r - 1][c] : 0;
      const left = c > 0 ? ways[r][c - 1] : 0;
      ways[r][c] = up + left;
    }
  }
  return ways[rows - 1][cols - 1];
}`,
          codes: {
            javascript: `function uniquePathsWithObstacles(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  if (grid[0][0] === 1) return 0;
  const ways = Array.from({ length: rows }, function () {
    return Array(cols).fill(0);
  });
  ways[0][0] = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        ways[r][c] = 0;
        continue;
      }
      if (r === 0 && c === 0) continue;
      const up = r > 0 ? ways[r - 1][c] : 0;
      const left = c > 0 ? ways[r][c - 1] : 0;
      ways[r][c] = up + left;
    }
  }
  return ways[rows - 1][cols - 1];
}`,
            python: `def uniquePathsWithObstacles(grid):
    rows, cols = len(grid), len(grid[0])
    if grid[0][0] == 1:
        return 0
    ways = [[0] * cols for _ in range(rows)]
    ways[0][0] = 1
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                ways[r][c] = 0
                continue
            if r == 0 and c == 0:
                continue
            up = ways[r - 1][c] if r > 0 else 0
            left = ways[r][c - 1] if c > 0 else 0
            ways[r][c] = up + left
    return ways[rows - 1][cols - 1]`,
            java: `class Solution {
    public int uniquePathsWithObstacles(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        if (grid[0][0] == 1) return 0;
        int[][] ways = new int[rows][cols];
        ways[0][0] = 1;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 1) {
                    ways[r][c] = 0;
                    continue;
                }
                if (r == 0 && c == 0) continue;
                int up = r > 0 ? ways[r - 1][c] : 0;
                int left = c > 0 ? ways[r][c - 1] : 0;
                ways[r][c] = up + left;
            }
        }
        return ways[rows - 1][cols - 1];
    }
}`,
            cpp: `int uniquePathsWithObstacles(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    if (grid[0][0] == 1) return 0;
    vector<vector<int>> ways(rows, vector<int>(cols, 0));
    ways[0][0] = 1;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 1) {
                ways[r][c] = 0;
                continue;
            }
            if (r == 0 && c == 0) continue;
            int up = r > 0 ? ways[r - 1][c] : 0;
            int left = c > 0 ? ways[r][c - 1] : 0;
            ways[r][c] = up + left;
        }
    }
    return ways[rows - 1][cols - 1];
}`,
            c: `int uniquePathsWithObstacles(int **grid, int rows, int cols) {
    int **ways, r, c, ans;
    if (grid[0][0] == 1) return 0;
    ways = (int **)malloc(rows * sizeof(int *));
    for (r = 0; r < rows; r++) ways[r] = (int *)calloc(cols, sizeof(int));
    ways[0][0] = 1;
    for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
            if (grid[r][c] == 1) {
                ways[r][c] = 0;
                continue;
            }
            if (r == 0 && c == 0) continue;
            ways[r][c] = (r > 0 ? ways[r - 1][c] : 0) + (c > 0 ? ways[r][c - 1] : 0);
        }
    }
    ans = ways[rows - 1][cols - 1];
    for (r = 0; r < rows; r++) free(ways[r]);
    free(ways);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(m * n)",
          space: "O(n)",
          why: "Reuse one row of width cols. A stone zeros ways[c]. A free cell adds the left cell in this row (already updated) onto the old ways[c] (the cell above). Same time, linear extra memory.",
          code: `function uniquePathsWithObstacles(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const ways = Array(cols).fill(0);
  ways[0] = grid[0][0] === 1 ? 0 : 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) ways[c] = 0;
      else if (c > 0) ways[c] += ways[c - 1];
    }
  }
  return ways[cols - 1];
}`,
          codes: {
            javascript: `function uniquePathsWithObstacles(grid) {
  const rows = grid.length;
  const cols = grid[0].length;
  const ways = Array(cols).fill(0);
  ways[0] = grid[0][0] === 1 ? 0 : 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) ways[c] = 0;
      else if (c > 0) ways[c] += ways[c - 1];
    }
  }
  return ways[cols - 1];
}`,
            python: `def uniquePathsWithObstacles(grid):
    rows, cols = len(grid), len(grid[0])
    ways = [0] * cols
    ways[0] = 0 if grid[0][0] == 1 else 1
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                ways[c] = 0
            elif c > 0:
                ways[c] += ways[c - 1]
    return ways[cols - 1]`,
            java: `class Solution {
    public int uniquePathsWithObstacles(int[][] grid) {
        int rows = grid.length, cols = grid[0].length;
        int[] ways = new int[cols];
        ways[0] = grid[0][0] == 1 ? 0 : 1;
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == 1) ways[c] = 0;
                else if (c > 0) ways[c] += ways[c - 1];
            }
        }
        return ways[cols - 1];
    }
}`,
            cpp: `int uniquePathsWithObstacles(vector<vector<int>>& grid) {
    int rows = grid.size(), cols = grid[0].size();
    vector<int> ways(cols, 0);
    ways[0] = grid[0][0] == 1 ? 0 : 1;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 1) ways[c] = 0;
            else if (c > 0) ways[c] += ways[c - 1];
        }
    }
    return ways[cols - 1];
}`,
            c: `int uniquePathsWithObstacles(int **grid, int rows, int cols) {
    int *ways = (int *)calloc(cols, sizeof(int));
    int r, c, ans;
    ways[0] = grid[0][0] == 1 ? 0 : 1;
    for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
            if (grid[r][c] == 1) ways[c] = 0;
            else if (c > 0) ways[c] += ways[c - 1];
        }
    }
    ans = ways[cols - 1];
    free(ways);
    return ans;
}`
          }
        }
      ]
    },
    {
      id: 10,
      level: "intermediate",
      q: "Jump Game II",
      ask: "Amazon · Google · Microsoft",
      a: "nums[i] is the farthest jump length from index i. You start at 0. You are promised the last index is reachable. Return the minimum number of jumps to reach the last index.\n\nTiny example: [2, 3, 1, 1, 4]. From 0 you can go to 1 or 2. From 1 you can reach the end in one more jump. Answer 2 (0 -> 1 -> 4).\n\nDP: best[i] is min jumps to i. From i you update i+1 .. i+nums[i]. The linear pass treats the array as BFS layers: the current window is one jump, farthest is the next window’s end.\n\nOpen the Brute, Optimal, and More optimal tabs for min-over-jumps recursion, the O(n^2) table, and the O(n) greedy windows.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^n)",
          space: "O(n)",
          why: "From i you try every legal step. No cache, so overlapping positions explode. Depth is at most n. Fine only as a correctness sketch.",
          code: `function jump(nums) {
  function go(i) {
    if (i >= nums.length - 1) return 0;
    let best = Infinity;
    for (let step = 1; step <= nums[i]; step++) {
      best = Math.min(best, 1 + go(i + step));
    }
    return best;
  }
  return go(0);
}`,
          codes: {
            javascript: `function jump(nums) {
  function go(i) {
    if (i >= nums.length - 1) return 0;
    let best = Infinity;
    for (let step = 1; step <= nums[i]; step++) {
      best = Math.min(best, 1 + go(i + step));
    }
    return best;
  }
  return go(0);
}`,
            python: `def jump(nums):
    INF = 10 ** 9
    def go(i):
        if i >= len(nums) - 1:
            return 0
        best = INF
        for step in range(1, nums[i] + 1):
            best = min(best, 1 + go(i + step))
        return best
    return go(0)`,
            java: `class Solution {
    public int jump(int[] nums) {
        return go(nums, 0);
    }
    private int go(int[] nums, int i) {
        if (i >= nums.length - 1) return 0;
        int best = 1000000000;
        for (int step = 1; step <= nums[i]; step++) {
            best = Math.min(best, 1 + go(nums, i + step));
        }
        return best;
    }
}`,
            cpp: `int jumpGo(vector<int>& nums, int i) {
    const int INF = 1000000000;
    if (i >= (int)nums.size() - 1) return 0;
    int best = INF;
    for (int step = 1; step <= nums[i]; step++) {
        best = min(best, 1 + jumpGo(nums, i + step));
    }
    return best;
}
int jump(vector<int>& nums) {
    return jumpGo(nums, 0);
}`,
            c: `int jumpGo(int *nums, int n, int i) {
    const int INF = 1000000000;
    int step, best;
    if (i >= n - 1) return 0;
    best = INF;
    for (step = 1; step <= nums[i]; step++) {
        int cand = 1 + jumpGo(nums, n, i + step);
        if (cand < best) best = cand;
    }
    return best;
}
int jump(int *nums, int n) {
    return jumpGo(nums, n, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n^2)",
          space: "O(n)",
          why: "best[j] is min jumps to index j. From each i you relax the range i+1 .. i+nums[i]. Up to n updates per i. This is the basic DP table for min jumps.",
          code: `function jump(nums) {
  const n = nums.length;
  const best = Array(n).fill(Infinity);
  best[0] = 0;
  for (let i = 0; i < n; i++) {
    for (let step = 1; step <= nums[i] && i + step < n; step++) {
      best[i + step] = Math.min(best[i + step], best[i] + 1);
    }
  }
  return best[n - 1];
}`,
          codes: {
            javascript: `function jump(nums) {
  const n = nums.length;
  const best = Array(n).fill(Infinity);
  best[0] = 0;
  for (let i = 0; i < n; i++) {
    for (let step = 1; step <= nums[i] && i + step < n; step++) {
      best[i + step] = Math.min(best[i + step], best[i] + 1);
    }
  }
  return best[n - 1];
}`,
            python: `def jump(nums):
    n = len(nums)
    INF = 10 ** 9
    best = [INF] * n
    best[0] = 0
    for i in range(n):
        step = 1
        while step <= nums[i] and i + step < n:
            best[i + step] = min(best[i + step], best[i] + 1)
            step += 1
    return best[n - 1]`,
            java: `class Solution {
    public int jump(int[] nums) {
        int n = nums.length;
        int INF = 1000000000;
        int[] best = new int[n];
        java.util.Arrays.fill(best, INF);
        best[0] = 0;
        for (int i = 0; i < n; i++) {
            for (int step = 1; step <= nums[i] && i + step < n; step++) {
                best[i + step] = Math.min(best[i + step], best[i] + 1);
            }
        }
        return best[n - 1];
    }
}`,
            cpp: `int jump(vector<int>& nums) {
    int n = nums.size();
    const int INF = 1000000000;
    vector<int> best(n, INF);
    best[0] = 0;
    for (int i = 0; i < n; i++) {
        for (int step = 1; step <= nums[i] && i + step < n; step++) {
            best[i + step] = min(best[i + step], best[i] + 1);
        }
    }
    return best[n - 1];
}`,
            c: `int jump(int *nums, int n) {
    const int INF = 1000000000;
    int *best = (int *)malloc(n * sizeof(int));
    int i, step, ans;
    for (i = 0; i < n; i++) best[i] = INF;
    best[0] = 0;
    for (i = 0; i < n; i++) {
        for (step = 1; step <= nums[i] && i + step < n; step++) {
            if (best[i] + 1 < best[i + step]) best[i + step] = best[i] + 1;
        }
    }
    ans = best[n - 1];
    free(best);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Greedy BFS on the line. end is the close of the current jump’s window. farthest is the furthest index a jump from this window can reach. When i hits end, you spend one jump and open the next window. One pass, no array.",
          code: `function jump(nums) {
  let jumps = 0;
  let end = 0;
  let farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === end) {
      jumps += 1;
      end = farthest;
    }
  }
  return jumps;
}`,
          codes: {
            javascript: `function jump(nums) {
  let jumps = 0;
  let end = 0;
  let farthest = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === end) {
      jumps += 1;
      end = farthest;
    }
  }
  return jumps;
}`,
            python: `def jump(nums):
    jumps = 0
    end = 0
    farthest = 0
    for i in range(len(nums) - 1):
        farthest = max(farthest, i + nums[i])
        if i == end:
            jumps += 1
            end = farthest
    return jumps`,
            java: `class Solution {
    public int jump(int[] nums) {
        int jumps = 0, end = 0, farthest = 0;
        for (int i = 0; i < nums.length - 1; i++) {
            farthest = Math.max(farthest, i + nums[i]);
            if (i == end) {
                jumps += 1;
                end = farthest;
            }
        }
        return jumps;
    }
}`,
            cpp: `int jump(vector<int>& nums) {
    int jumps = 0, end = 0, farthest = 0;
    for (int i = 0; i < (int)nums.size() - 1; i++) {
        farthest = max(farthest, i + nums[i]);
        if (i == end) {
            jumps += 1;
            end = farthest;
        }
    }
    return jumps;
}`,
            c: `int jump(int *nums, int n) {
    int jumps = 0, end = 0, farthest = 0, i;
    for (i = 0; i < n - 1; i++) {
        if (i + nums[i] > farthest) farthest = i + nums[i];
        if (i == end) {
            jumps += 1;
            end = farthest;
        }
    }
    return jumps;
}`
          }
        }
      ]
    },
    {
      id: 11,
      level: "intermediate",
      q: "Partition Equal Subset Sum",
      ask: "Amazon · Google · Meta",
      a: "Return true if you can split nums into two subsets with equal sum. Each number is used at most once.\n\nTiny example: [1, 5, 11, 5]. Total 22, so each subset needs 11. {11} and {1, 5, 5} work. Answer true. [1, 2, 3, 5] totals 11 (odd). Answer false.\n\nIf the total is odd, return false. Otherwise this is 0/1 subset sum with need = total/2. Take or skip each number.\n\nOpen the Brute, Optimal, and More optimal tabs for include/skip recursion, the 2D boolean table, and one backwards boolean row.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n)",
          space: "O(n)",
          why: "Each number is included or skipped. No cache. 2^n subsets. The odd-total check is the only prune. Stack is O(n).",
          code: `function canPartition(nums) {
  const total = nums.reduce(function (a, b) { return a + b; }, 0);
  if (total % 2 !== 0) return false;
  const need = total / 2;
  function go(i, remain) {
    if (remain === 0) return true;
    if (i === nums.length || remain < 0) return false;
    return go(i + 1, remain - nums[i]) || go(i + 1, remain);
  }
  return go(0, need);
}`,
          codes: {
            javascript: `function canPartition(nums) {
  const total = nums.reduce(function (a, b) { return a + b; }, 0);
  if (total % 2 !== 0) return false;
  const need = total / 2;
  function go(i, remain) {
    if (remain === 0) return true;
    if (i === nums.length || remain < 0) return false;
    return go(i + 1, remain - nums[i]) || go(i + 1, remain);
  }
  return go(0, need);
}`,
            python: `def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    need = total // 2
    def go(i, remain):
        if remain == 0:
            return True
        if i == len(nums) or remain < 0:
            return False
        return go(i + 1, remain - nums[i]) or go(i + 1, remain)
    return go(0, need)`,
            java: `class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int x : nums) total += x;
        if (total % 2 != 0) return false;
        return go(nums, 0, total / 2);
    }
    private boolean go(int[] nums, int i, int remain) {
        if (remain == 0) return true;
        if (i == nums.length || remain < 0) return false;
        return go(nums, i + 1, remain - nums[i]) || go(nums, i + 1, remain);
    }
}`,
            cpp: `bool partGo(vector<int>& nums, int i, int remain) {
    if (remain == 0) return true;
    if (i == (int)nums.size() || remain < 0) return false;
    return partGo(nums, i + 1, remain - nums[i]) || partGo(nums, i + 1, remain);
}
bool canPartition(vector<int>& nums) {
    int total = 0;
    for (int x : nums) total += x;
    if (total % 2 != 0) return false;
    return partGo(nums, 0, total / 2);
}`,
            c: `int partGo(int *nums, int n, int i, int remain) {
    if (remain == 0) return 1;
    if (i == n || remain < 0) return 0;
    return partGo(nums, n, i + 1, remain - nums[i]) || partGo(nums, n, i + 1, remain);
}
int canPartition(int *nums, int n) {
    int total = 0, i;
    for (i = 0; i < n; i++) total += nums[i];
    if (total % 2 != 0) return 0;
    return partGo(nums, n, 0, total / 2);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * sum)",
          space: "O(n * sum)",
          why: "can[i][s] is true if some subset of the first i numbers adds to s. Classic 0/1 knapsack boolean table. n * (sum/2) cells, each O(1).",
          code: `function canPartition(nums) {
  const total = nums.reduce(function (a, b) { return a + b; }, 0);
  if (total % 2 !== 0) return false;
  const need = total / 2;
  const n = nums.length;
  const can = Array.from({ length: n + 1 }, function () {
    return Array(need + 1).fill(false);
  });
  for (let i = 0; i <= n; i++) can[i][0] = true;
  for (let i = 1; i <= n; i++) {
    for (let s = 1; s <= need; s++) {
      can[i][s] = can[i - 1][s];
      if (nums[i - 1] <= s) {
        can[i][s] = can[i][s] || can[i - 1][s - nums[i - 1]];
      }
    }
  }
  return can[n][need];
}`,
          codes: {
            javascript: `function canPartition(nums) {
  const total = nums.reduce(function (a, b) { return a + b; }, 0);
  if (total % 2 !== 0) return false;
  const need = total / 2;
  const n = nums.length;
  const can = Array.from({ length: n + 1 }, function () {
    return Array(need + 1).fill(false);
  });
  for (let i = 0; i <= n; i++) can[i][0] = true;
  for (let i = 1; i <= n; i++) {
    for (let s = 1; s <= need; s++) {
      can[i][s] = can[i - 1][s];
      if (nums[i - 1] <= s) {
        can[i][s] = can[i][s] || can[i - 1][s - nums[i - 1]];
      }
    }
  }
  return can[n][need];
}`,
            python: `def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    need = total // 2
    n = len(nums)
    can = [[False] * (need + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        can[i][0] = True
    for i in range(1, n + 1):
        for s in range(1, need + 1):
            can[i][s] = can[i - 1][s]
            if nums[i - 1] <= s:
                can[i][s] = can[i][s] or can[i - 1][s - nums[i - 1]]
    return can[n][need]`,
            java: `class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int x : nums) total += x;
        if (total % 2 != 0) return false;
        int need = total / 2;
        int n = nums.length;
        boolean[][] can = new boolean[n + 1][need + 1];
        for (int i = 0; i <= n; i++) can[i][0] = true;
        for (int i = 1; i <= n; i++) {
            for (int s = 1; s <= need; s++) {
                can[i][s] = can[i - 1][s];
                if (nums[i - 1] <= s) {
                    can[i][s] = can[i][s] || can[i - 1][s - nums[i - 1]];
                }
            }
        }
        return can[n][need];
    }
}`,
            cpp: `bool canPartition(vector<int>& nums) {
    int total = 0;
    for (int x : nums) total += x;
    if (total % 2 != 0) return false;
    int need = total / 2;
    int n = nums.size();
    vector<vector<char>> can(n + 1, vector<char>(need + 1, 0));
    for (int i = 0; i <= n; i++) can[i][0] = 1;
    for (int i = 1; i <= n; i++) {
        for (int s = 1; s <= need; s++) {
            can[i][s] = can[i - 1][s];
            if (nums[i - 1] <= s) can[i][s] = can[i][s] || can[i - 1][s - nums[i - 1]];
        }
    }
    return can[n][need];
}`,
            c: `int canPartition(int *nums, int n) {
    int total = 0, i, s, need, ans;
    int **can;
    for (i = 0; i < n; i++) total += nums[i];
    if (total % 2 != 0) return 0;
    need = total / 2;
    can = (int **)malloc((n + 1) * sizeof(int *));
    for (i = 0; i <= n; i++) can[i] = (int *)calloc(need + 1, sizeof(int));
    for (i = 0; i <= n; i++) can[i][0] = 1;
    for (i = 1; i <= n; i++) {
        for (s = 1; s <= need; s++) {
            can[i][s] = can[i - 1][s];
            if (nums[i - 1] <= s && can[i - 1][s - nums[i - 1]]) can[i][s] = 1;
        }
    }
    ans = can[n][need];
    for (i = 0; i <= n; i++) free(can[i]);
    free(can);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * sum)",
          space: "O(sum)",
          why: "One boolean row. Walk s from need down to num so each number is used at most once. Same 0/1 rule as knapsack space cut. Extra memory is need+1 flags.",
          code: `function canPartition(nums) {
  const total = nums.reduce(function (a, b) { return a + b; }, 0);
  if (total % 2 !== 0) return false;
  const need = total / 2;
  const can = Array(need + 1).fill(false);
  can[0] = true;
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    for (let s = need; s >= num; s--) {
      if (can[s - num]) can[s] = true;
    }
  }
  return can[need];
}`,
          codes: {
            javascript: `function canPartition(nums) {
  const total = nums.reduce(function (a, b) { return a + b; }, 0);
  if (total % 2 !== 0) return false;
  const need = total / 2;
  const can = Array(need + 1).fill(false);
  can[0] = true;
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    for (let s = need; s >= num; s--) {
      if (can[s - num]) can[s] = true;
    }
  }
  return can[need];
}`,
            python: `def canPartition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    need = total // 2
    can = [False] * (need + 1)
    can[0] = True
    for num in nums:
        for s in range(need, num - 1, -1):
            if can[s - num]:
                can[s] = True
    return can[need]`,
            java: `class Solution {
    public boolean canPartition(int[] nums) {
        int total = 0;
        for (int x : nums) total += x;
        if (total % 2 != 0) return false;
        int need = total / 2;
        boolean[] can = new boolean[need + 1];
        can[0] = true;
        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];
            for (int s = need; s >= num; s--) {
                if (can[s - num]) can[s] = true;
            }
        }
        return can[need];
    }
}`,
            cpp: `bool canPartition(vector<int>& nums) {
    int total = 0;
    for (int x : nums) total += x;
    if (total % 2 != 0) return false;
    int need = total / 2;
    vector<char> can(need + 1, 0);
    can[0] = 1;
    for (int i = 0; i < (int)nums.size(); i++) {
        int num = nums[i];
        for (int s = need; s >= num; s--) {
            if (can[s - num]) can[s] = 1;
        }
    }
    return can[need];
}`,
            c: `int canPartition(int *nums, int n) {
    int total = 0, i, s, need, ans;
    int *can;
    for (i = 0; i < n; i++) total += nums[i];
    if (total % 2 != 0) return 0;
    need = total / 2;
    can = (int *)calloc(need + 1, sizeof(int));
    can[0] = 1;
    for (i = 0; i < n; i++) {
        int num = nums[i];
        for (s = need; s >= num; s--) {
            if (can[s - num]) can[s] = 1;
        }
    }
    ans = can[need];
    free(can);
    return ans;
}`
          }
        }
      ]
    },
    {
      id: 12,
      level: "intermediate",
      q: "0/1 Knapsack",
      ask: "Amazon · Google · Microsoft",
      a: "Each item has values[i] and weights[i]. Take each item at most once. Capacity is the bag limit. Return the maximum total value that still fits.\n\nTiny example: values = [6, 10, 12], weights = [1, 2, 3], capacity = 5. Items 1 and 2 (10+12) weigh 5. Answer 22.\n\nState (i, w) is best value from the first i items with leftover capacity w. Skip copies the previous row. Take adds this value if the weight fits.\n\nOpen the Brute, Optimal, and More optimal tabs for take/skip recursion, the 2D table, and the backwards 1D row.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n)",
          space: "O(n)",
          why: "Each item is taken or skipped. No cache. Exponential in the number of items. Depth is n.",
          code: `function knapsack(values, weights, capacity) {
  function go(i, remain) {
    if (i === values.length) return 0;
    const skip = go(i + 1, remain);
    let take = 0;
    if (weights[i] <= remain) {
      take = values[i] + go(i + 1, remain - weights[i]);
    }
    return Math.max(skip, take);
  }
  return go(0, capacity);
}`,
          codes: {
            javascript: `function knapsack(values, weights, capacity) {
  function go(i, remain) {
    if (i === values.length) return 0;
    const skip = go(i + 1, remain);
    let take = 0;
    if (weights[i] <= remain) {
      take = values[i] + go(i + 1, remain - weights[i]);
    }
    return Math.max(skip, take);
  }
  return go(0, capacity);
}`,
            python: `def knapsack(values, weights, capacity):
    def go(i, remain):
        if i == len(values):
            return 0
        skip = go(i + 1, remain)
        take = 0
        if weights[i] <= remain:
            take = values[i] + go(i + 1, remain - weights[i])
        return max(skip, take)
    return go(0, capacity)`,
            java: `class Solution {
    public int knapsack(int[] values, int[] weights, int capacity) {
        return go(values, weights, 0, capacity);
    }
    private int go(int[] values, int[] weights, int i, int remain) {
        if (i == values.length) return 0;
        int skip = go(values, weights, i + 1, remain);
        int take = 0;
        if (weights[i] <= remain) {
            take = values[i] + go(values, weights, i + 1, remain - weights[i]);
        }
        return Math.max(skip, take);
    }
}`,
            cpp: `int knapGo(vector<int>& values, vector<int>& weights, int i, int remain) {
    if (i == (int)values.size()) return 0;
    int skip = knapGo(values, weights, i + 1, remain);
    int take = 0;
    if (weights[i] <= remain) {
        take = values[i] + knapGo(values, weights, i + 1, remain - weights[i]);
    }
    return max(skip, take);
}
int knapsack(vector<int>& values, vector<int>& weights, int capacity) {
    return knapGo(values, weights, 0, capacity);
}`,
            c: `int knapGo(int *values, int *weights, int n, int i, int remain) {
    int skip, take = 0;
    if (i == n) return 0;
    skip = knapGo(values, weights, n, i + 1, remain);
    if (weights[i] <= remain) {
        take = values[i] + knapGo(values, weights, n, i + 1, remain - weights[i]);
    }
    return skip > take ? skip : take;
}
int knapsack(int *values, int *weights, int n, int capacity) {
    return knapGo(values, weights, n, 0, capacity);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * W)",
          space: "O(n * W)",
          why: "Full table: n+1 rows, W+1 columns. Each cell is a max of skip and take. W is capacity. This is the picture you should be able to fill by hand.",
          code: `function knapsack(values, weights, capacity) {
  const n = values.length;
  const dp = Array.from({ length: n + 1 }, function () {
    return Array(capacity + 1).fill(0);
  });
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w) {
        const take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
        dp[i][w] = Math.max(dp[i][w], take);
      }
    }
  }
  return dp[n][capacity];
}`,
          codes: {
            javascript: `function knapsack(values, weights, capacity) {
  const n = values.length;
  const dp = Array.from({ length: n + 1 }, function () {
    return Array(capacity + 1).fill(0);
  });
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      dp[i][w] = dp[i - 1][w];
      if (weights[i - 1] <= w) {
        const take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
        dp[i][w] = Math.max(dp[i][w], take);
      }
    }
  }
  return dp[n][capacity];
}`,
            python: `def knapsack(values, weights, capacity):
    n = len(values)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    for i in range(1, n + 1):
        for w in range(0, capacity + 1):
            dp[i][w] = dp[i - 1][w]
            if weights[i - 1] <= w:
                take = dp[i - 1][w - weights[i - 1]] + values[i - 1]
                dp[i][w] = max(dp[i][w], take)
    return dp[n][capacity]`,
            java: `class Solution {
    public int knapsack(int[] values, int[] weights, int capacity) {
        int n = values.length;
        int[][] dp = new int[n + 1][capacity + 1];
        for (int i = 1; i <= n; i++) {
            for (int w = 0; w <= capacity; w++) {
                dp[i][w] = dp[i - 1][w];
                if (weights[i - 1] <= w) {
                    int take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
                    dp[i][w] = Math.max(dp[i][w], take);
                }
            }
        }
        return dp[n][capacity];
    }
}`,
            cpp: `int knapsack(vector<int>& values, vector<int>& weights, int capacity) {
    int n = values.size();
    vector<vector<int>> dp(n + 1, vector<int>(capacity + 1, 0));
    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];
            if (weights[i - 1] <= w) {
                int take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
                dp[i][w] = max(dp[i][w], take);
            }
        }
    }
    return dp[n][capacity];
}`,
            c: `int knapsack(int *values, int *weights, int n, int capacity) {
    int **dp = (int **)malloc((n + 1) * sizeof(int *));
    int i, w, ans;
    for (i = 0; i <= n; i++) dp[i] = (int *)calloc(capacity + 1, sizeof(int));
    for (i = 1; i <= n; i++) {
        for (w = 0; w <= capacity; w++) {
            dp[i][w] = dp[i - 1][w];
            if (weights[i - 1] <= w) {
                int take = dp[i - 1][w - weights[i - 1]] + values[i - 1];
                if (take > dp[i][w]) dp[i][w] = take;
            }
        }
    }
    ans = dp[n][capacity];
    for (i = 0; i <= n; i++) free(dp[i]);
    free(dp);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * W)",
          space: "O(W)",
          why: "One row of size W+1. Inner loop walks capacity from high to low so best[w - weight] is still the previous item’s row. Forward would reuse the same item (unbounded).",
          code: `function knapsack(values, weights, capacity) {
  const best = Array(capacity + 1).fill(0);
  for (let i = 0; i < values.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      best[w] = Math.max(best[w], best[w - weights[i]] + values[i]);
    }
  }
  return best[capacity];
}`,
          codes: {
            javascript: `function knapsack(values, weights, capacity) {
  const best = Array(capacity + 1).fill(0);
  for (let i = 0; i < values.length; i++) {
    for (let w = capacity; w >= weights[i]; w--) {
      best[w] = Math.max(best[w], best[w - weights[i]] + values[i]);
    }
  }
  return best[capacity];
}`,
            python: `def knapsack(values, weights, capacity):
    best = [0] * (capacity + 1)
    for i in range(len(values)):
        for w in range(capacity, weights[i] - 1, -1):
            best[w] = max(best[w], best[w - weights[i]] + values[i])
    return best[capacity]`,
            java: `class Solution {
    public int knapsack(int[] values, int[] weights, int capacity) {
        int[] best = new int[capacity + 1];
        for (int i = 0; i < values.length; i++) {
            for (int w = capacity; w >= weights[i]; w--) {
                best[w] = Math.max(best[w], best[w - weights[i]] + values[i]);
            }
        }
        return best[capacity];
    }
}`,
            cpp: `int knapsack(vector<int>& values, vector<int>& weights, int capacity) {
    vector<int> best(capacity + 1, 0);
    for (int i = 0; i < (int)values.size(); i++) {
        for (int w = capacity; w >= weights[i]; w--) {
            best[w] = max(best[w], best[w - weights[i]] + values[i]);
        }
    }
    return best[capacity];
}`,
            c: `int knapsack(int *values, int *weights, int n, int capacity) {
    int *best = (int *)calloc(capacity + 1, sizeof(int));
    int i, w, ans;
    for (i = 0; i < n; i++) {
        for (w = capacity; w >= weights[i]; w--) {
            int take = best[w - weights[i]] + values[i];
            if (take > best[w]) best[w] = take;
        }
    }
    ans = best[capacity];
    free(best);
    return ans;
}`
          }
        }
      ]
    },
    {
      id: 13,
      level: "advanced",
      q: "Edit Distance",
      ask: "Google · Amazon · Microsoft · Meta",
      a: "Return the fewest operations to turn word1 into word2. Allowed operations: insert one letter, delete one letter, replace one letter. Each costs 1.\n\nTiny example: word1 = \"horse\", word2 = \"ros\". horse -> rorse (replace h), rorse -> rose (delete r), rose -> ros (delete e). Answer 3.\n\nIf the current letters match, cost is the diagonal (no op). If they differ, cost is 1 + min(insert, delete, replace). Empty prefixes cost the leftover length (all inserts or all deletes).\n\nOpen the Brute, Optimal, and More optimal tabs for 3-way recursion, the full Levenshtein table, and two rolling rows.",
      solutions: [
        {
          name: "Brute",
          time: "O(3^{m+n})",
          space: "O(m + n)",
          why: "Mismatch tries insert, delete, and replace. Those three-way branches overlap heavily. Depth is the remaining letters. Unusable on long strings.",
          code: `function minDistance(word1, word2) {
  function go(i, j) {
    if (i === word1.length) return word2.length - j;
    if (j === word2.length) return word1.length - i;
    if (word1[i] === word2[j]) return go(i + 1, j + 1);
    const insert = 1 + go(i, j + 1);
    const del = 1 + go(i + 1, j);
    const replace = 1 + go(i + 1, j + 1);
    return Math.min(insert, del, replace);
  }
  return go(0, 0);
}`,
          codes: {
            javascript: `function minDistance(word1, word2) {
  function go(i, j) {
    if (i === word1.length) return word2.length - j;
    if (j === word2.length) return word1.length - i;
    if (word1[i] === word2[j]) return go(i + 1, j + 1);
    const insert = 1 + go(i, j + 1);
    const del = 1 + go(i + 1, j);
    const replace = 1 + go(i + 1, j + 1);
    return Math.min(insert, del, replace);
  }
  return go(0, 0);
}`,
            python: `def minDistance(word1, word2):
    def go(i, j):
        if i == len(word1):
            return len(word2) - j
        if j == len(word2):
            return len(word1) - i
        if word1[i] == word2[j]:
            return go(i + 1, j + 1)
        insert = 1 + go(i, j + 1)
        delete = 1 + go(i + 1, j)
        replace = 1 + go(i + 1, j + 1)
        return min(insert, delete, replace)
    return go(0, 0)`,
            java: `class Solution {
    public int minDistance(String word1, String word2) {
        return go(word1, word2, 0, 0);
    }
    private int go(String word1, String word2, int i, int j) {
        if (i == word1.length()) return word2.length() - j;
        if (j == word2.length()) return word1.length() - i;
        if (word1.charAt(i) == word2.charAt(j)) return go(word1, word2, i + 1, j + 1);
        int insert = 1 + go(word1, word2, i, j + 1);
        int del = 1 + go(word1, word2, i + 1, j);
        int replace = 1 + go(word1, word2, i + 1, j + 1);
        return Math.min(insert, Math.min(del, replace));
    }
}`,
            cpp: `int distGo(const string& word1, const string& word2, int i, int j) {
    if (i == (int)word1.size()) return (int)word2.size() - j;
    if (j == (int)word2.size()) return (int)word1.size() - i;
    if (word1[i] == word2[j]) return distGo(word1, word2, i + 1, j + 1);
    int insert = 1 + distGo(word1, word2, i, j + 1);
    int del = 1 + distGo(word1, word2, i + 1, j);
    int replace = 1 + distGo(word1, word2, i + 1, j + 1);
    return min(insert, min(del, replace));
}
int minDistance(string word1, string word2) {
    return distGo(word1, word2, 0, 0);
}`,
            c: `int distGo(const char *word1, const char *word2, int i, int j) {
    int insert, del, replace, m;
    if (word1[i] == 0) return (int)strlen(word2 + j);
    if (word2[j] == 0) return (int)strlen(word1 + i);
    if (word1[i] == word2[j]) return distGo(word1, word2, i + 1, j + 1);
    insert = 1 + distGo(word1, word2, i, j + 1);
    del = 1 + distGo(word1, word2, i + 1, j);
    replace = 1 + distGo(word1, word2, i + 1, j + 1);
    m = insert < del ? insert : del;
    return m < replace ? m : replace;
}
int minDistance(const char *word1, const char *word2) {
    return distGo(word1, word2, 0, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(m * n)",
          space: "O(m * n)",
          why: "dp[i][j] is edit distance of the first i letters and first j letters. Borders are i and j. Each inner cell is O(1). The table is the standard Levenshtein grid.",
          code: `function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, function () {
    return Array(n + 1).fill(0);
  });
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
          codes: {
            javascript: `function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  const dp = Array.from({ length: m + 1 }, function () {
    return Array(n + 1).fill(0);
  });
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }
  return dp[m][n];
}`,
            python: `def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[m][n]`,
            java: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) dp[i][0] = i;
        for (int j = 0; j <= n; j++) dp[0][j] = j;
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));
                }
            }
        }
        return dp[m][n];
    }
}`,
            cpp: `int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else dp[i][j] = 1 + min(dp[i - 1][j], min(dp[i][j - 1], dp[i - 1][j - 1]));
        }
    }
    return dp[m][n];
}`,
            c: `int minDistance(const char *word1, const char *word2) {
    int m = (int)strlen(word1), n = (int)strlen(word2);
    int **dp = (int **)malloc((m + 1) * sizeof(int *));
    int i, j, ans, t;
    for (i = 0; i <= m; i++) dp[i] = (int *)calloc(n + 1, sizeof(int));
    for (i = 0; i <= m; i++) dp[i][0] = i;
    for (j = 0; j <= n; j++) dp[0][j] = j;
    for (i = 1; i <= m; i++) {
        for (j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
            else {
                t = dp[i - 1][j] < dp[i][j - 1] ? dp[i - 1][j] : dp[i][j - 1];
                if (dp[i - 1][j - 1] < t) t = dp[i - 1][j - 1];
                dp[i][j] = 1 + t;
            }
        }
    }
    ans = dp[m][n];
    for (i = 0; i <= m; i++) free(dp[i]);
    free(dp);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(m * n)",
          space: "O(n)",
          why: "A cell needs the previous row (delete, replace) and the current row’s left (insert). Keep prev and cur. Extra memory is the length of word2 plus one.",
          code: `function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  let prev = Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    const cur = Array(n + 1);
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) cur[j] = prev[j - 1];
      else cur[j] = 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
    }
    prev = cur;
  }
  return prev[n];
}`,
          codes: {
            javascript: `function minDistance(word1, word2) {
  const m = word1.length;
  const n = word2.length;
  let prev = Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) {
    const cur = Array(n + 1);
    cur[0] = i;
    for (let j = 1; j <= n; j++) {
      if (word1[i - 1] === word2[j - 1]) cur[j] = prev[j - 1];
      else cur[j] = 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
    }
    prev = cur;
  }
  return prev[n];
}`,
            python: `def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    prev = list(range(n + 1))
    for i in range(1, m + 1):
        cur = [0] * (n + 1)
        cur[0] = i
        for j in range(1, n + 1):
            if word1[i - 1] == word2[j - 1]:
                cur[j] = prev[j - 1]
            else:
                cur[j] = 1 + min(prev[j], cur[j - 1], prev[j - 1])
        prev = cur
    return prev[n]`,
            java: `class Solution {
    public int minDistance(String word1, String word2) {
        int m = word1.length(), n = word2.length();
        int[] prev = new int[n + 1];
        for (int j = 0; j <= n; j++) prev[j] = j;
        for (int i = 1; i <= m; i++) {
            int[] cur = new int[n + 1];
            cur[0] = i;
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) cur[j] = prev[j - 1];
                else cur[j] = 1 + Math.min(prev[j], Math.min(cur[j - 1], prev[j - 1]));
            }
            prev = cur;
        }
        return prev[n];
    }
}`,
            cpp: `int minDistance(string word1, string word2) {
    int m = word1.size(), n = word2.size();
    vector<int> prev(n + 1);
    for (int j = 0; j <= n; j++) prev[j] = j;
    for (int i = 1; i <= m; i++) {
        vector<int> cur(n + 1);
        cur[0] = i;
        for (int j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) cur[j] = prev[j - 1];
            else cur[j] = 1 + min(prev[j], min(cur[j - 1], prev[j - 1]));
        }
        prev.swap(cur);
    }
    return prev[n];
}`,
            c: `int minDistance(const char *word1, const char *word2) {
    int m = (int)strlen(word1), n = (int)strlen(word2);
    int *prev = (int *)malloc((n + 1) * sizeof(int));
    int i, j, t, ans;
    for (j = 0; j <= n; j++) prev[j] = j;
    for (i = 1; i <= m; i++) {
        int *cur = (int *)malloc((n + 1) * sizeof(int));
        cur[0] = i;
        for (j = 1; j <= n; j++) {
            if (word1[i - 1] == word2[j - 1]) cur[j] = prev[j - 1];
            else {
                t = prev[j] < cur[j - 1] ? prev[j] : cur[j - 1];
                if (prev[j - 1] < t) t = prev[j - 1];
                cur[j] = 1 + t;
            }
        }
        free(prev);
        prev = cur;
    }
    ans = prev[n];
    free(prev);
    return ans;
}`
          }
        }
      ]
    },
    {
      id: 14,
      level: "intermediate",
      q: "Decode Ways",
      ask: "Amazon · Google · Meta · Apple",
      a: "A mapping 1 -> A, 2 -> B, …, 26 -> Z is given. s is a digit string. Return how many ways to decode it into letters. Leading zeros are invalid. \"06\" is 0 ways. \"10\" is 1 way (J). \"226\" is 3 ways (BBF, VF, BZ).\n\nAt index i, if s[i] is 1..9 you may take one digit. If s[i..i+1] is 10..26 you may take two. A 0 can only finish a two-digit code 10 or 20.\n\nOpen the Brute, Optimal, and More optimal tabs for recursion from index i, a memo on i, and two rolling way-counts.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n)",
          space: "O(n)",
          why: "Each position may branch into a 1-digit take and a 2-digit take. Overlapping suffixes are recomputed. Zeros prune some branches but the worst case is still exponential.",
          code: `function numDecodings(s) {
  function go(i) {
    if (i === s.length) return 1;
    if (s[i] === "0") return 0;
    let ways = go(i + 1);
    if (i + 1 < s.length) {
      const two = Number(s[i] + s[i + 1]);
      if (two >= 10 && two <= 26) ways += go(i + 2);
    }
    return ways;
  }
  return go(0);
}`,
          codes: {
            javascript: `function numDecodings(s) {
  function go(i) {
    if (i === s.length) return 1;
    if (s[i] === "0") return 0;
    let ways = go(i + 1);
    if (i + 1 < s.length) {
      const two = Number(s[i] + s[i + 1]);
      if (two >= 10 && two <= 26) ways += go(i + 2);
    }
    return ways;
  }
  return go(0);
}`,
            python: `def numDecodings(s):
    def go(i):
        if i == len(s):
            return 1
        if s[i] == "0":
            return 0
        ways = go(i + 1)
        if i + 1 < len(s):
            two = int(s[i] + s[i + 1])
            if 10 <= two <= 26:
                ways += go(i + 2)
        return ways
    return go(0)`,
            java: `class Solution {
    public int numDecodings(String s) {
        return go(s, 0);
    }
    private int go(String s, int i) {
        if (i == s.length()) return 1;
        if (s.charAt(i) == '0') return 0;
        int ways = go(s, i + 1);
        if (i + 1 < s.length()) {
            int two = (s.charAt(i) - '0') * 10 + (s.charAt(i + 1) - '0');
            if (two >= 10 && two <= 26) ways += go(s, i + 2);
        }
        return ways;
    }
}`,
            cpp: `int decGo(const string& s, int i) {
    if (i == (int)s.size()) return 1;
    if (s[i] == '0') return 0;
    int ways = decGo(s, i + 1);
    if (i + 1 < (int)s.size()) {
        int two = (s[i] - '0') * 10 + (s[i + 1] - '0');
        if (two >= 10 && two <= 26) ways += decGo(s, i + 2);
    }
    return ways;
}
int numDecodings(string s) {
    return decGo(s, 0);
}`,
            c: `int decGo(const char *s, int i) {
    int ways, two;
    if (s[i] == 0) return 1;
    if (s[i] == '0') return 0;
    ways = decGo(s, i + 1);
    if (s[i + 1] != 0) {
        two = (s[i] - '0') * 10 + (s[i + 1] - '0');
        if (two >= 10 && two <= 26) ways += decGo(s, i + 2);
    }
    return ways;
}
int numDecodings(const char *s) {
    return decGo(s, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Each start index is solved once. Work per index is O(1) digit checks. Memo of n cells plus the call stack. Linear in the length of s.",
          code: `function numDecodings(s) {
  const memo = [];
  function go(i) {
    if (i === s.length) return 1;
    if (s[i] === "0") return 0;
    if (memo[i] !== undefined) return memo[i];
    let ways = go(i + 1);
    if (i + 1 < s.length) {
      const two = Number(s[i] + s[i + 1]);
      if (two >= 10 && two <= 26) ways += go(i + 2);
    }
    memo[i] = ways;
    return ways;
  }
  return go(0);
}`,
          codes: {
            javascript: `function numDecodings(s) {
  const memo = [];
  function go(i) {
    if (i === s.length) return 1;
    if (s[i] === "0") return 0;
    if (memo[i] !== undefined) return memo[i];
    let ways = go(i + 1);
    if (i + 1 < s.length) {
      const two = Number(s[i] + s[i + 1]);
      if (two >= 10 && two <= 26) ways += go(i + 2);
    }
    memo[i] = ways;
    return ways;
  }
  return go(0);
}`,
            python: `def numDecodings(s):
    memo = {}
    def go(i):
        if i == len(s):
            return 1
        if s[i] == "0":
            return 0
        if i in memo:
            return memo[i]
        ways = go(i + 1)
        if i + 1 < len(s):
            two = int(s[i] + s[i + 1])
            if 10 <= two <= 26:
                ways += go(i + 2)
        memo[i] = ways
        return ways
    return go(0)`,
            java: `class Solution {
    public int numDecodings(String s) {
        Integer[] memo = new Integer[s.length()];
        return go(s, 0, memo);
    }
    private int go(String s, int i, Integer[] memo) {
        if (i == s.length()) return 1;
        if (s.charAt(i) == '0') return 0;
        if (memo[i] != null) return memo[i];
        int ways = go(s, i + 1, memo);
        if (i + 1 < s.length()) {
            int two = (s.charAt(i) - '0') * 10 + (s.charAt(i + 1) - '0');
            if (two >= 10 && two <= 26) ways += go(s, i + 2, memo);
        }
        memo[i] = ways;
        return ways;
    }
}`,
            cpp: `int decGo(const string& s, int i, vector<int>& memo) {
    if (i == (int)s.size()) return 1;
    if (s[i] == '0') return 0;
    if (memo[i] != -1) return memo[i];
    int ways = decGo(s, i + 1, memo);
    if (i + 1 < (int)s.size()) {
        int two = (s[i] - '0') * 10 + (s[i + 1] - '0');
        if (two >= 10 && two <= 26) ways += decGo(s, i + 2, memo);
    }
    memo[i] = ways;
    return ways;
}
int numDecodings(string s) {
    vector<int> memo(s.size(), -1);
    return decGo(s, 0, memo);
}`,
            c: `int decGo(const char *s, int i, int *memo) {
    int ways, two;
    if (s[i] == 0) return 1;
    if (s[i] == '0') return 0;
    if (memo[i] != -1) return memo[i];
    ways = decGo(s, i + 1, memo);
    if (s[i + 1] != 0) {
        two = (s[i] - '0') * 10 + (s[i + 1] - '0');
        if (two >= 10 && two <= 26) ways += decGo(s, i + 2, memo);
    }
    memo[i] = ways;
    return ways;
}
int numDecodings(const char *s) {
    int n = (int)strlen(s);
    int *memo = (int *)malloc(n * sizeof(int));
    int i, ans;
    for (i = 0; i < n; i++) memo[i] = -1;
    ans = decGo(s, 0, memo);
    free(memo);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "prev1 is ways for the prefix ending here, prev2 is ways for the prefix one shorter. A one-digit code adds prev1. A two-digit code adds prev2. Empty string and a leading zero are the bases. No array.",
          code: `function numDecodings(s) {
  if (!s.length || s[0] === "0") return 0;
  let prev2 = 1;
  let prev1 = 1;
  for (let i = 1; i < s.length; i++) {
    let cur = 0;
    if (s[i] !== "0") cur += prev1;
    const two = Number(s[i - 1] + s[i]);
    if (two >= 10 && two <= 26) cur += prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
          codes: {
            javascript: `function numDecodings(s) {
  if (!s.length || s[0] === "0") return 0;
  let prev2 = 1;
  let prev1 = 1;
  for (let i = 1; i < s.length; i++) {
    let cur = 0;
    if (s[i] !== "0") cur += prev1;
    const two = Number(s[i - 1] + s[i]);
    if (two >= 10 && two <= 26) cur += prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
            python: `def numDecodings(s):
    if not s or s[0] == "0":
        return 0
    prev2, prev1 = 1, 1
    for i in range(1, len(s)):
        cur = 0
        if s[i] != "0":
            cur += prev1
        two = int(s[i - 1] + s[i])
        if 10 <= two <= 26:
            cur += prev2
        prev2 = prev1
        prev1 = cur
    return prev1`,
            java: `class Solution {
    public int numDecodings(String s) {
        if (s.length() == 0 || s.charAt(0) == '0') return 0;
        int prev2 = 1, prev1 = 1;
        for (int i = 1; i < s.length(); i++) {
            int cur = 0;
            if (s.charAt(i) != '0') cur += prev1;
            int two = (s.charAt(i - 1) - '0') * 10 + (s.charAt(i) - '0');
            if (two >= 10 && two <= 26) cur += prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
            cpp: `int numDecodings(string s) {
    if (s.empty() || s[0] == '0') return 0;
    int prev2 = 1, prev1 = 1;
    for (int i = 1; i < (int)s.size(); i++) {
        int cur = 0;
        if (s[i] != '0') cur += prev1;
        int two = (s[i - 1] - '0') * 10 + (s[i] - '0');
        if (two >= 10 && two <= 26) cur += prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`,
            c: `int numDecodings(const char *s) {
    int n = (int)strlen(s);
    int prev2, prev1, i, cur, two;
    if (n == 0 || s[0] == '0') return 0;
    prev2 = 1;
    prev1 = 1;
    for (i = 1; i < n; i++) {
        cur = 0;
        if (s[i] != '0') cur += prev1;
        two = (s[i - 1] - '0') * 10 + (s[i] - '0');
        if (two >= 10 && two <= 26) cur += prev2;
        prev2 = prev1;
        prev1 = cur;
    }
    return prev1;
}`
          }
        }
      ]
    },
    {
      id: 15,
      level: "beginner",
      q: "Best Time to Buy and Sell Stock II",
      ask: "Amazon · Google · Apple",
      a: "prices[i] is the price on day i. You may buy and sell as many times as you like, but you hold at most one share. You cannot buy and sell on a timeline that overlaps. Return the maximum profit.\n\nTiny example: [7, 1, 5, 3, 6, 4]. Buy at 1, sell at 5 (profit 4), buy at 3, sell at 6 (profit 3). Answer 7.\n\nDP state is (day, holding or not). Greedy is the same as summing every uphill day-to-day gain: any climb can be taken as a 1-day trade, and that matches the best multi-day hold.\n\nOpen the Brute, Optimal, and More optimal tabs for buy/skip recursion, cash/hold arrays, and the uphill sum.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n)",
          space: "O(n)",
          why: "At each day you skip, buy, or sell depending on holding. Two branches most days, no cache. Exponential in the number of days.",
          code: `function maxProfit(prices) {
  function go(i, holding) {
    if (i === prices.length) return 0;
    if (holding) {
      const sell = prices[i] + go(i + 1, 0);
      const keep = go(i + 1, 1);
      return Math.max(sell, keep);
    }
    const buy = -prices[i] + go(i + 1, 1);
    const skip = go(i + 1, 0);
    return Math.max(buy, skip);
  }
  return go(0, 0);
}`,
          codes: {
            javascript: `function maxProfit(prices) {
  function go(i, holding) {
    if (i === prices.length) return 0;
    if (holding) {
      const sell = prices[i] + go(i + 1, 0);
      const keep = go(i + 1, 1);
      return Math.max(sell, keep);
    }
    const buy = -prices[i] + go(i + 1, 1);
    const skip = go(i + 1, 0);
    return Math.max(buy, skip);
  }
  return go(0, 0);
}`,
            python: `def maxProfit(prices):
    def go(i, holding):
        if i == len(prices):
            return 0
        if holding:
            sell = prices[i] + go(i + 1, 0)
            keep = go(i + 1, 1)
            return max(sell, keep)
        buy = -prices[i] + go(i + 1, 1)
        skip = go(i + 1, 0)
        return max(buy, skip)
    return go(0, 0)`,
            java: `class Solution {
    public int maxProfit(int[] prices) {
        return go(prices, 0, 0);
    }
    private int go(int[] prices, int i, int holding) {
        if (i == prices.length) return 0;
        if (holding == 1) {
            int sell = prices[i] + go(prices, i + 1, 0);
            int keep = go(prices, i + 1, 1);
            return Math.max(sell, keep);
        }
        int buy = -prices[i] + go(prices, i + 1, 1);
        int skip = go(prices, i + 1, 0);
        return Math.max(buy, skip);
    }
}`,
            cpp: `int profitGo(vector<int>& prices, int i, int holding) {
    if (i == (int)prices.size()) return 0;
    if (holding) {
        int sell = prices[i] + profitGo(prices, i + 1, 0);
        int keep = profitGo(prices, i + 1, 1);
        return max(sell, keep);
    }
    int buy = -prices[i] + profitGo(prices, i + 1, 1);
    int skip = profitGo(prices, i + 1, 0);
    return max(buy, skip);
}
int maxProfit(vector<int>& prices) {
    return profitGo(prices, 0, 0);
}`,
            c: `int profitGo(int *prices, int n, int i, int holding) {
    int sell, keep, buy, skip;
    if (i == n) return 0;
    if (holding) {
        sell = prices[i] + profitGo(prices, n, i + 1, 0);
        keep = profitGo(prices, n, i + 1, 1);
        return sell > keep ? sell : keep;
    }
    buy = -prices[i] + profitGo(prices, n, i + 1, 1);
    skip = profitGo(prices, n, i + 1, 0);
    return buy > skip ? buy : skip;
}
int maxProfit(int *prices, int n) {
    return profitGo(prices, n, 0, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "cash[i] is best profit ending day i with no share. hold[i] is best ending day i with a share. Transitions are skip vs sell, and skip vs buy. n days, two arrays.",
          code: `function maxProfit(prices) {
  const n = prices.length;
  if (n === 0) return 0;
  const cash = Array(n).fill(0);
  const hold = Array(n).fill(0);
  hold[0] = -prices[0];
  for (let i = 1; i < n; i++) {
    cash[i] = Math.max(cash[i - 1], hold[i - 1] + prices[i]);
    hold[i] = Math.max(hold[i - 1], cash[i - 1] - prices[i]);
  }
  return cash[n - 1];
}`,
          codes: {
            javascript: `function maxProfit(prices) {
  const n = prices.length;
  if (n === 0) return 0;
  const cash = Array(n).fill(0);
  const hold = Array(n).fill(0);
  hold[0] = -prices[0];
  for (let i = 1; i < n; i++) {
    cash[i] = Math.max(cash[i - 1], hold[i - 1] + prices[i]);
    hold[i] = Math.max(hold[i - 1], cash[i - 1] - prices[i]);
  }
  return cash[n - 1];
}`,
            python: `def maxProfit(prices):
    n = len(prices)
    if n == 0:
        return 0
    cash = [0] * n
    hold = [0] * n
    hold[0] = -prices[0]
    for i in range(1, n):
        cash[i] = max(cash[i - 1], hold[i - 1] + prices[i])
        hold[i] = max(hold[i - 1], cash[i - 1] - prices[i])
    return cash[n - 1]`,
            java: `class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        if (n == 0) return 0;
        int[] cash = new int[n];
        int[] hold = new int[n];
        hold[0] = -prices[0];
        for (int i = 1; i < n; i++) {
            cash[i] = Math.max(cash[i - 1], hold[i - 1] + prices[i]);
            hold[i] = Math.max(hold[i - 1], cash[i - 1] - prices[i]);
        }
        return cash[n - 1];
    }
}`,
            cpp: `int maxProfit(vector<int>& prices) {
    int n = prices.size();
    if (n == 0) return 0;
    vector<int> cash(n, 0), hold(n, 0);
    hold[0] = -prices[0];
    for (int i = 1; i < n; i++) {
        cash[i] = max(cash[i - 1], hold[i - 1] + prices[i]);
        hold[i] = max(hold[i - 1], cash[i - 1] - prices[i]);
    }
    return cash[n - 1];
}`,
            c: `int maxProfit(int *prices, int n) {
    int *cash, *hold, i, ans;
    if (n == 0) return 0;
    cash = (int *)calloc(n, sizeof(int));
    hold = (int *)calloc(n, sizeof(int));
    hold[0] = -prices[0];
    for (i = 1; i < n; i++) {
        int a = cash[i - 1], b = hold[i - 1] + prices[i];
        cash[i] = a > b ? a : b;
        a = hold[i - 1];
        b = cash[i - 1] - prices[i];
        hold[i] = a > b ? a : b;
    }
    ans = cash[n - 1];
    free(cash);
    free(hold);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Every profitable adjacent difference can be taken. That sum equals the DP. One pass, no extra arrays. Mention this is the space-cut of the two-state DP, not a different problem.",
          code: `function maxProfit(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }
  return profit;
}`,
          codes: {
            javascript: `function maxProfit(prices) {
  let profit = 0;
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > prices[i - 1]) {
      profit += prices[i] - prices[i - 1];
    }
  }
  return profit;
}`,
            python: `def maxProfit(prices):
    profit = 0
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            profit += prices[i] - prices[i - 1]
    return profit`,
            java: `class Solution {
    public int maxProfit(int[] prices) {
        int profit = 0;
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) {
                profit += prices[i] - prices[i - 1];
            }
        }
        return profit;
    }
}`,
            cpp: `int maxProfit(vector<int>& prices) {
    int profit = 0;
    for (int i = 1; i < (int)prices.size(); i++) {
        if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
    }
    return profit;
}`,
            c: `int maxProfit(int *prices, int n) {
    int profit = 0, i;
    for (i = 1; i < n; i++) {
        if (prices[i] > prices[i - 1]) profit += prices[i] - prices[i - 1];
    }
    return profit;
}`
          }
        }
      ]
    },
    {
      id: 16,
      level: "advanced",
      q: "Best Time to Buy and Sell Stock with Cooldown",
      ask: "Google · Amazon · Meta",
      a: "Same as Stock II (many buys and sells, one share at a time), plus a cooldown: after you sell, you must skip the next day before buying again.\n\nTiny example: [1, 2, 3, 0, 2]. Buy 1, sell 2, cooldown on 3, buy 0, sell 2. Profit 3.\n\nThree states: hold (you have a share), sold (you sold today), rest (you are free to buy, and you did not sell today). You may buy only from rest. Tomorrow’s rest may come from today’s rest or today’s sold.\n\nOpen the Brute, Optimal, and More optimal tabs for recursion with a cooldown flag, three DP arrays, and three rolling numbers.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n)",
          space: "O(n)",
          why: "State is (day, holding, cooldown). Branches are buy/skip/sell. No cache. Exponential in n. Correct, too slow on long price lists.",
          code: `function maxProfit(prices) {
  function go(i, holding, cooldown) {
    if (i === prices.length) return 0;
    if (holding) {
      const sell = prices[i] + go(i + 1, 0, true);
      const keep = go(i + 1, 1, false);
      return Math.max(sell, keep);
    }
    const skip = go(i + 1, 0, false);
    if (cooldown) return skip;
    const buy = -prices[i] + go(i + 1, 1, false);
    return Math.max(skip, buy);
  }
  return go(0, 0, false);
}`,
          codes: {
            javascript: `function maxProfit(prices) {
  function go(i, holding, cooldown) {
    if (i === prices.length) return 0;
    if (holding) {
      const sell = prices[i] + go(i + 1, 0, true);
      const keep = go(i + 1, 1, false);
      return Math.max(sell, keep);
    }
    const skip = go(i + 1, 0, false);
    if (cooldown) return skip;
    const buy = -prices[i] + go(i + 1, 1, false);
    return Math.max(skip, buy);
  }
  return go(0, 0, false);
}`,
            python: `def maxProfit(prices):
    def go(i, holding, cooldown):
        if i == len(prices):
            return 0
        if holding:
            sell = prices[i] + go(i + 1, 0, True)
            keep = go(i + 1, 1, False)
            return max(sell, keep)
        skip = go(i + 1, 0, False)
        if cooldown:
            return skip
        buy = -prices[i] + go(i + 1, 1, False)
        return max(skip, buy)
    return go(0, 0, False)`,
            java: `class Solution {
    public int maxProfit(int[] prices) {
        return go(prices, 0, 0, false);
    }
    private int go(int[] prices, int i, int holding, boolean cooldown) {
        if (i == prices.length) return 0;
        if (holding == 1) {
            int sell = prices[i] + go(prices, i + 1, 0, true);
            int keep = go(prices, i + 1, 1, false);
            return Math.max(sell, keep);
        }
        int skip = go(prices, i + 1, 0, false);
        if (cooldown) return skip;
        int buy = -prices[i] + go(prices, i + 1, 1, false);
        return Math.max(skip, buy);
    }
}`,
            cpp: `int cdGo(vector<int>& prices, int i, int holding, int cooldown) {
    if (i == (int)prices.size()) return 0;
    if (holding) {
        int sell = prices[i] + cdGo(prices, i + 1, 0, 1);
        int keep = cdGo(prices, i + 1, 1, 0);
        return max(sell, keep);
    }
    int skip = cdGo(prices, i + 1, 0, 0);
    if (cooldown) return skip;
    int buy = -prices[i] + cdGo(prices, i + 1, 1, 0);
    return max(skip, buy);
}
int maxProfit(vector<int>& prices) {
    return cdGo(prices, 0, 0, 0);
}`,
            c: `int cdGo(int *prices, int n, int i, int holding, int cooldown) {
    int sell, keep, skip, buy;
    if (i == n) return 0;
    if (holding) {
        sell = prices[i] + cdGo(prices, n, i + 1, 0, 1);
        keep = cdGo(prices, n, i + 1, 1, 0);
        return sell > keep ? sell : keep;
    }
    skip = cdGo(prices, n, i + 1, 0, 0);
    if (cooldown) return skip;
    buy = -prices[i] + cdGo(prices, n, i + 1, 1, 0);
    return skip > buy ? skip : buy;
}
int maxProfit(int *prices, int n) {
    return cdGo(prices, n, 0, 0, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "hold[i], sold[i], rest[i] are the three states after day i. Each is O(1) from yesterday. n days times 3 cells. This is the table that matches the cooldown rule one-to-one.",
          code: `function maxProfit(prices) {
  const n = prices.length;
  if (n === 0) return 0;
  const hold = Array(n).fill(0);
  const sold = Array(n).fill(0);
  const rest = Array(n).fill(0);
  hold[0] = -prices[0];
  sold[0] = 0;
  rest[0] = 0;
  for (let i = 1; i < n; i++) {
    hold[i] = Math.max(hold[i - 1], rest[i - 1] - prices[i]);
    sold[i] = hold[i - 1] + prices[i];
    rest[i] = Math.max(rest[i - 1], sold[i - 1]);
  }
  return Math.max(sold[n - 1], rest[n - 1]);
}`,
          codes: {
            javascript: `function maxProfit(prices) {
  const n = prices.length;
  if (n === 0) return 0;
  const hold = Array(n).fill(0);
  const sold = Array(n).fill(0);
  const rest = Array(n).fill(0);
  hold[0] = -prices[0];
  sold[0] = 0;
  rest[0] = 0;
  for (let i = 1; i < n; i++) {
    hold[i] = Math.max(hold[i - 1], rest[i - 1] - prices[i]);
    sold[i] = hold[i - 1] + prices[i];
    rest[i] = Math.max(rest[i - 1], sold[i - 1]);
  }
  return Math.max(sold[n - 1], rest[n - 1]);
}`,
            python: `def maxProfit(prices):
    n = len(prices)
    if n == 0:
        return 0
    hold = [0] * n
    sold = [0] * n
    rest = [0] * n
    hold[0] = -prices[0]
    sold[0] = 0
    rest[0] = 0
    for i in range(1, n):
        hold[i] = max(hold[i - 1], rest[i - 1] - prices[i])
        sold[i] = hold[i - 1] + prices[i]
        rest[i] = max(rest[i - 1], sold[i - 1])
    return max(sold[n - 1], rest[n - 1])`,
            java: `class Solution {
    public int maxProfit(int[] prices) {
        int n = prices.length;
        if (n == 0) return 0;
        int[] hold = new int[n];
        int[] sold = new int[n];
        int[] rest = new int[n];
        hold[0] = -prices[0];
        sold[0] = 0;
        rest[0] = 0;
        for (int i = 1; i < n; i++) {
            hold[i] = Math.max(hold[i - 1], rest[i - 1] - prices[i]);
            sold[i] = hold[i - 1] + prices[i];
            rest[i] = Math.max(rest[i - 1], sold[i - 1]);
        }
        return Math.max(sold[n - 1], rest[n - 1]);
    }
}`,
            cpp: `int maxProfit(vector<int>& prices) {
    int n = prices.size();
    if (n == 0) return 0;
    vector<int> hold(n, 0), sold(n, 0), rest(n, 0);
    hold[0] = -prices[0];
    sold[0] = 0;
    rest[0] = 0;
    for (int i = 1; i < n; i++) {
        hold[i] = max(hold[i - 1], rest[i - 1] - prices[i]);
        sold[i] = hold[i - 1] + prices[i];
        rest[i] = max(rest[i - 1], sold[i - 1]);
    }
    return max(sold[n - 1], rest[n - 1]);
}`,
            c: `int maxProfit(int *prices, int n) {
    int *hold, *sold, *rest, i, ans, a, b;
    if (n == 0) return 0;
    hold = (int *)calloc(n, sizeof(int));
    sold = (int *)calloc(n, sizeof(int));
    rest = (int *)calloc(n, sizeof(int));
    hold[0] = -prices[0];
    for (i = 1; i < n; i++) {
        a = hold[i - 1];
        b = rest[i - 1] - prices[i];
        hold[i] = a > b ? a : b;
        sold[i] = hold[i - 1] + prices[i];
        a = rest[i - 1];
        b = sold[i - 1];
        rest[i] = a > b ? a : b;
    }
    ans = sold[n - 1] > rest[n - 1] ? sold[n - 1] : rest[n - 1];
    free(hold);
    free(sold);
    free(rest);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Only yesterday’s three numbers are live. Copy them into nextHold, nextSold, nextRest, then slide. Same linear scan, constant extra memory.",
          code: `function maxProfit(prices) {
  let hold = -Infinity;
  let sold = 0;
  let rest = 0;
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    const nextHold = Math.max(hold, rest - price);
    const nextSold = hold + price;
    const nextRest = Math.max(rest, sold);
    hold = nextHold;
    sold = nextSold;
    rest = nextRest;
  }
  return Math.max(sold, rest);
}`,
          codes: {
            javascript: `function maxProfit(prices) {
  let hold = -Infinity;
  let sold = 0;
  let rest = 0;
  for (let i = 0; i < prices.length; i++) {
    const price = prices[i];
    const nextHold = Math.max(hold, rest - price);
    const nextSold = hold + price;
    const nextRest = Math.max(rest, sold);
    hold = nextHold;
    sold = nextSold;
    rest = nextRest;
  }
  return Math.max(sold, rest);
}`,
            python: `def maxProfit(prices):
    hold = float("-inf")
    sold = 0
    rest = 0
    for price in prices:
        nextHold = max(hold, rest - price)
        nextSold = hold + price
        nextRest = max(rest, sold)
        hold = nextHold
        sold = nextSold
        rest = nextRest
    return max(sold, rest)`,
            java: `class Solution {
    public int maxProfit(int[] prices) {
        int hold = -1000000000;
        int sold = 0;
        int rest = 0;
        for (int i = 0; i < prices.length; i++) {
            int price = prices[i];
            int nextHold = Math.max(hold, rest - price);
            int nextSold = hold + price;
            int nextRest = Math.max(rest, sold);
            hold = nextHold;
            sold = nextSold;
            rest = nextRest;
        }
        return Math.max(sold, rest);
    }
}`,
            cpp: `int maxProfit(vector<int>& prices) {
    int hold = -1000000000;
    int sold = 0;
    int rest = 0;
    for (int i = 0; i < (int)prices.size(); i++) {
        int price = prices[i];
        int nextHold = max(hold, rest - price);
        int nextSold = hold + price;
        int nextRest = max(rest, sold);
        hold = nextHold;
        sold = nextSold;
        rest = nextRest;
    }
    return max(sold, rest);
}`,
            c: `int maxProfit(int *prices, int n) {
    int hold = -1000000000;
    int sold = 0;
    int rest = 0;
    int i;
    for (i = 0; i < n; i++) {
        int price = prices[i];
        int nextHold = hold > rest - price ? hold : rest - price;
        int nextSold = hold + price;
        int nextRest = rest > sold ? rest : sold;
        hold = nextHold;
        sold = nextSold;
        rest = nextRest;
    }
    return sold > rest ? sold : rest;
}`
          }
        }
      ]
    },
    {
      id: 17,
      level: "intermediate",
      q: "Target Sum",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "You have a list of non-negative integers. Place a + or a - in front of each number. Return how many ways the signed sum equals target.\n\nTiny example: nums = [1, 1, 1, 1, 1], target = 3. Five ways pick which one number is the minus. Answer 5.\n\nLet P be the subset with plus and N the subset with minus. P + N = total and P - N = target, so P = (total + target) / 2. The count becomes 0/1 knapsack ways to make that subset sum. If total+target is odd or |target| > total, the answer is 0.\n\nOpen the Brute, Optimal, and More optimal tabs for +/- recursion, memo on (index, running sum), and the subset-sum ways row.",
      solutions: [
        {
          name: "Brute",
          time: "O(2^n)",
          space: "O(n)",
          why: "Each number branches into plus or minus. 2^n signed assignments. Stack is n. Fine as a correctness check on tiny n.",
          code: `function findTargetSumWays(nums, target) {
  function go(i, sum) {
    if (i === nums.length) return sum === target ? 1 : 0;
    return go(i + 1, sum + nums[i]) + go(i + 1, sum - nums[i]);
  }
  return go(0, 0);
}`,
          codes: {
            javascript: `function findTargetSumWays(nums, target) {
  function go(i, sum) {
    if (i === nums.length) return sum === target ? 1 : 0;
    return go(i + 1, sum + nums[i]) + go(i + 1, sum - nums[i]);
  }
  return go(0, 0);
}`,
            python: `def findTargetSumWays(nums, target):
    def go(i, total):
        if i == len(nums):
            return 1 if total == target else 0
        return go(i + 1, total + nums[i]) + go(i + 1, total - nums[i])
    return go(0, 0)`,
            java: `class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        return go(nums, target, 0, 0);
    }
    private int go(int[] nums, int target, int i, int sum) {
        if (i == nums.length) return sum == target ? 1 : 0;
        return go(nums, target, i + 1, sum + nums[i]) + go(nums, target, i + 1, sum - nums[i]);
    }
}`,
            cpp: `int targetGo(vector<int>& nums, int target, int i, int sum) {
    if (i == (int)nums.size()) return sum == target ? 1 : 0;
    return targetGo(nums, target, i + 1, sum + nums[i]) + targetGo(nums, target, i + 1, sum - nums[i]);
}
int findTargetSumWays(vector<int>& nums, int target) {
    return targetGo(nums, target, 0, 0);
}`,
            c: `int targetGo(int *nums, int n, int target, int i, int sum) {
    if (i == n) return sum == target ? 1 : 0;
    return targetGo(nums, n, target, i + 1, sum + nums[i]) +
           targetGo(nums, n, target, i + 1, sum - nums[i]);
}
int findTargetSumWays(int *nums, int n, int target) {
    return targetGo(nums, n, target, 0, 0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * sum)",
          space: "O(n * sum)",
          why: "Memo keys are (index, running sum). Running sum ranges about [-total, total], so unique states are O(n * total). Each state does two branches once.",
          code: `function findTargetSumWays(nums, target) {
  const memo = new Map();
  function go(i, sum) {
    const key = i + ":" + sum;
    if (memo.has(key)) return memo.get(key);
    if (i === nums.length) {
      const ans = sum === target ? 1 : 0;
      memo.set(key, ans);
      return ans;
    }
    const ways = go(i + 1, sum + nums[i]) + go(i + 1, sum - nums[i]);
    memo.set(key, ways);
    return ways;
  }
  return go(0, 0);
}`,
          codes: {
            javascript: `function findTargetSumWays(nums, target) {
  const memo = new Map();
  function go(i, sum) {
    const key = i + ":" + sum;
    if (memo.has(key)) return memo.get(key);
    if (i === nums.length) {
      const ans = sum === target ? 1 : 0;
      memo.set(key, ans);
      return ans;
    }
    const ways = go(i + 1, sum + nums[i]) + go(i + 1, sum - nums[i]);
    memo.set(key, ways);
    return ways;
  }
  return go(0, 0);
}`,
            python: `def findTargetSumWays(nums, target):
    memo = {}
    def go(i, total):
        key = (i, total)
        if key in memo:
            return memo[key]
        if i == len(nums):
            ans = 1 if total == target else 0
            memo[key] = ans
            return ans
        ways = go(i + 1, total + nums[i]) + go(i + 1, total - nums[i])
        memo[key] = ways
        return ways
    return go(0, 0)`,
            java: `class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        java.util.HashMap<String, Integer> memo = new java.util.HashMap<String, Integer>();
        return go(nums, target, 0, 0, memo);
    }
    private int go(int[] nums, int target, int i, int sum, java.util.HashMap<String, Integer> memo) {
        String key = i + ":" + sum;
        if (memo.containsKey(key)) return memo.get(key);
        if (i == nums.length) {
            int ans = sum == target ? 1 : 0;
            memo.put(key, ans);
            return ans;
        }
        int ways = go(nums, target, i + 1, sum + nums[i], memo) + go(nums, target, i + 1, sum - nums[i], memo);
        memo.put(key, ways);
        return ways;
    }
}`,
            cpp: `int targetGo(vector<int>& nums, int target, int i, int sum, unordered_map<string, int>& memo) {
    string key = to_string(i) + ":" + to_string(sum);
    if (memo.count(key)) return memo[key];
    if (i == (int)nums.size()) {
        int ans = sum == target ? 1 : 0;
        memo[key] = ans;
        return ans;
    }
    int ways = targetGo(nums, target, i + 1, sum + nums[i], memo) +
               targetGo(nums, target, i + 1, sum - nums[i], memo);
    memo[key] = ways;
    return ways;
}
int findTargetSumWays(vector<int>& nums, int target) {
    unordered_map<string, int> memo;
    return targetGo(nums, target, 0, 0, memo);
}`,
            c: `int targetGo(int *nums, int n, int target, int i, int sum, int **memo, int offset) {
    int idx = sum + offset;
    if (memo[i][idx] != -1) return memo[i][idx];
    if (i == n) {
        memo[i][idx] = sum == target ? 1 : 0;
        return memo[i][idx];
    }
    memo[i][idx] = targetGo(nums, n, target, i + 1, sum + nums[i], memo, offset) +
                   targetGo(nums, n, target, i + 1, sum - nums[i], memo, offset);
    return memo[i][idx];
}
int findTargetSumWays(int *nums, int n, int target) {
    int total = 0, i, ans, width;
    int **memo;
    for (i = 0; i < n; i++) total += nums[i];
    width = 2 * total + 1;
    memo = (int **)malloc((n + 1) * sizeof(int *));
    for (i = 0; i <= n; i++) {
        int j;
        memo[i] = (int *)malloc(width * sizeof(int));
        for (j = 0; j < width; j++) memo[i][j] = -1;
    }
    ans = targetGo(nums, n, target, 0, 0, memo, total);
    for (i = 0; i <= n; i++) free(memo[i]);
    free(memo);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * sum)",
          space: "O(sum)",
          why: "Map onto 0/1 subset-sum ways for need = (total + target) / 2. One ways[] row, inner loop backwards so each number is used once. Cleaner bottom-up, same polynomial, smaller constant memory.",
          code: `function findTargetSumWays(nums, target) {
  const total = nums.reduce(function (a, b) { return a + b; }, 0);
  if (Math.abs(target) > total || (total + target) % 2 !== 0) return 0;
  const need = (total + target) / 2;
  const ways = Array(need + 1).fill(0);
  ways[0] = 1;
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    for (let s = need; s >= num; s--) {
      ways[s] += ways[s - num];
    }
  }
  return ways[need];
}`,
          codes: {
            javascript: `function findTargetSumWays(nums, target) {
  const total = nums.reduce(function (a, b) { return a + b; }, 0);
  if (Math.abs(target) > total || (total + target) % 2 !== 0) return 0;
  const need = (total + target) / 2;
  const ways = Array(need + 1).fill(0);
  ways[0] = 1;
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    for (let s = need; s >= num; s--) {
      ways[s] += ways[s - num];
    }
  }
  return ways[need];
}`,
            python: `def findTargetSumWays(nums, target):
    total = sum(nums)
    if abs(target) > total or (total + target) % 2 != 0:
        return 0
    need = (total + target) // 2
    ways = [0] * (need + 1)
    ways[0] = 1
    for num in nums:
        for s in range(need, num - 1, -1):
            ways[s] += ways[s - num]
    return ways[need]`,
            java: `class Solution {
    public int findTargetSumWays(int[] nums, int target) {
        int total = 0;
        for (int x : nums) total += x;
        if (Math.abs(target) > total || (total + target) % 2 != 0) return 0;
        int need = (total + target) / 2;
        int[] ways = new int[need + 1];
        ways[0] = 1;
        for (int i = 0; i < nums.length; i++) {
            int num = nums[i];
            for (int s = need; s >= num; s--) {
                ways[s] += ways[s - num];
            }
        }
        return ways[need];
    }
}`,
            cpp: `int findTargetSumWays(vector<int>& nums, int target) {
    int total = 0;
    for (int x : nums) total += x;
    if (abs(target) > total || (total + target) % 2 != 0) return 0;
    int need = (total + target) / 2;
    vector<int> ways(need + 1, 0);
    ways[0] = 1;
    for (int i = 0; i < (int)nums.size(); i++) {
        int num = nums[i];
        for (int s = need; s >= num; s--) ways[s] += ways[s - num];
    }
    return ways[need];
}`,
            c: `int findTargetSumWays(int *nums, int n, int target) {
    int total = 0, i, s, need, ans;
    int *ways;
    for (i = 0; i < n; i++) total += nums[i];
    if (target < 0 ? -target > total : target > total) return 0;
    if ((total + target) % 2 != 0) return 0;
    need = (total + target) / 2;
    ways = (int *)calloc(need + 1, sizeof(int));
    ways[0] = 1;
    for (i = 0; i < n; i++) {
        int num = nums[i];
        for (s = need; s >= num; s--) ways[s] += ways[s - num];
    }
    ans = ways[need];
    free(ways);
    return ans;
}`
          }
        }
      ]
    },
    {
      id: 18,
      level: "intermediate",
      q: "Combination Sum",
      ask: "Amazon · Google · Apple · Microsoft",
      a: "candidates holds distinct positive integers. You may reuse a number as often as you like. Return how many combinations (order does not matter) add to target. Listing the actual bags is the same backtrack with a path array; interviews that ask for the list want that brute tree. The DP counts the bags.\n\nTiny example: candidates = [1, 2, 3], target = 4. Combinations: [1,1,1,1], [1,1,2], [2,2], [1,3]. Answer 4. (If order counted, [1,3] and [3,1] would both score; that is Combination Sum IV, and you would loop the sum outer.)\n\nBrute walks from a start index so [1,2] and [2,1] are the same bag. Memo caches (start, remain). The 1D row loops coins in the outer loop so each combination is counted once.\n\nOpen the Brute, Optimal, and More optimal tabs for unlimited-reuse backtracking, memoized counts, and the unbounded knapsack ways row.",
      solutions: [
        {
          name: "Brute",
          time: "O(n^{target/min})",
          space: "O(target / min)",
          why: "From start you may reuse candidates[i] (call go(i, remain - value)) or move on. Order is frozen by the index, so combinations are unique. No cache; the tree size tracks how you can pile the smallest coin. Depth is about target / min(candidates).",
          code: `function combinationSum(candidates, target) {
  function go(start, remain) {
    if (remain === 0) return 1;
    if (remain < 0) return 0;
    let ways = 0;
    for (let i = start; i < candidates.length; i++) {
      ways += go(i, remain - candidates[i]);
    }
    return ways;
  }
  return go(0, target);
}`,
          codes: {
            javascript: `function combinationSum(candidates, target) {
  function go(start, remain) {
    if (remain === 0) return 1;
    if (remain < 0) return 0;
    let ways = 0;
    for (let i = start; i < candidates.length; i++) {
      ways += go(i, remain - candidates[i]);
    }
    return ways;
  }
  return go(0, target);
}`,
            python: `def combinationSum(candidates, target):
    def go(start, remain):
        if remain == 0:
            return 1
        if remain < 0:
            return 0
        ways = 0
        for i in range(start, len(candidates)):
            ways += go(i, remain - candidates[i])
        return ways
    return go(0, target)`,
            java: `class Solution {
    public int combinationSum(int[] candidates, int target) {
        return go(candidates, 0, target);
    }
    private int go(int[] candidates, int start, int remain) {
        if (remain == 0) return 1;
        if (remain < 0) return 0;
        int ways = 0;
        for (int i = start; i < candidates.length; i++) {
            ways += go(candidates, i, remain - candidates[i]);
        }
        return ways;
    }
}`,
            cpp: `int combGo(vector<int>& candidates, int start, int remain) {
    if (remain == 0) return 1;
    if (remain < 0) return 0;
    int ways = 0;
    for (int i = start; i < (int)candidates.size(); i++) {
        ways += combGo(candidates, i, remain - candidates[i]);
    }
    return ways;
}
int combinationSum(vector<int>& candidates, int target) {
    return combGo(candidates, 0, target);
}`,
            c: `int combGo(int *candidates, int n, int start, int remain) {
    int ways = 0, i;
    if (remain == 0) return 1;
    if (remain < 0) return 0;
    for (i = start; i < n; i++) {
        ways += combGo(candidates, n, i, remain - candidates[i]);
    }
    return ways;
}
int combinationSum(int *candidates, int n, int target) {
    return combGo(candidates, n, 0, target);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n * target)",
          space: "O(n * target)",
          why: "Each pair (start index, remaining target) is solved once. Work per state is a loop over the leftover candidates. Map size is O(n * target). Same combination semantics as the backtrack.",
          code: `function combinationSum(candidates, target) {
  const memo = new Map();
  function go(start, remain) {
    const key = start + ":" + remain;
    if (memo.has(key)) return memo.get(key);
    if (remain === 0) {
      memo.set(key, 1);
      return 1;
    }
    if (remain < 0) return 0;
    let ways = 0;
    for (let i = start; i < candidates.length; i++) {
      ways += go(i, remain - candidates[i]);
    }
    memo.set(key, ways);
    return ways;
  }
  return go(0, target);
}`,
          codes: {
            javascript: `function combinationSum(candidates, target) {
  const memo = new Map();
  function go(start, remain) {
    const key = start + ":" + remain;
    if (memo.has(key)) return memo.get(key);
    if (remain === 0) {
      memo.set(key, 1);
      return 1;
    }
    if (remain < 0) return 0;
    let ways = 0;
    for (let i = start; i < candidates.length; i++) {
      ways += go(i, remain - candidates[i]);
    }
    memo.set(key, ways);
    return ways;
  }
  return go(0, target);
}`,
            python: `def combinationSum(candidates, target):
    memo = {}
    def go(start, remain):
        key = (start, remain)
        if key in memo:
            return memo[key]
        if remain == 0:
            memo[key] = 1
            return 1
        if remain < 0:
            return 0
        ways = 0
        for i in range(start, len(candidates)):
            ways += go(i, remain - candidates[i])
        memo[key] = ways
        return ways
    return go(0, target)`,
            java: `class Solution {
    public int combinationSum(int[] candidates, int target) {
        java.util.HashMap<String, Integer> memo = new java.util.HashMap<String, Integer>();
        return go(candidates, 0, target, memo);
    }
    private int go(int[] candidates, int start, int remain, java.util.HashMap<String, Integer> memo) {
        String key = start + ":" + remain;
        if (memo.containsKey(key)) return memo.get(key);
        if (remain == 0) {
            memo.put(key, 1);
            return 1;
        }
        if (remain < 0) return 0;
        int ways = 0;
        for (int i = start; i < candidates.length; i++) {
            ways += go(candidates, i, remain - candidates[i], memo);
        }
        memo.put(key, ways);
        return ways;
    }
}`,
            cpp: `int combGo(vector<int>& candidates, int start, int remain, unordered_map<string, int>& memo) {
    string key = to_string(start) + ":" + to_string(remain);
    if (memo.count(key)) return memo[key];
    if (remain == 0) {
        memo[key] = 1;
        return 1;
    }
    if (remain < 0) return 0;
    int ways = 0;
    for (int i = start; i < (int)candidates.size(); i++) {
        ways += combGo(candidates, i, remain - candidates[i], memo);
    }
    memo[key] = ways;
    return ways;
}
int combinationSum(vector<int>& candidates, int target) {
    unordered_map<string, int> memo;
    return combGo(candidates, 0, target, memo);
}`,
            c: `int combGo(int *candidates, int n, int start, int remain, int **memo, int **seen) {
    int ways = 0, i;
    if (remain == 0) return 1;
    if (remain < 0) return 0;
    if (seen[start][remain]) return memo[start][remain];
    for (i = start; i < n; i++) {
        ways += combGo(candidates, n, i, remain - candidates[i], memo, seen);
    }
    seen[start][remain] = 1;
    memo[start][remain] = ways;
    return ways;
}
int combinationSum(int *candidates, int n, int target) {
    int **memo, **seen, i, ans;
    if (n == 0) return target == 0 ? 1 : 0;
    memo = (int **)malloc(n * sizeof(int *));
    seen = (int **)malloc(n * sizeof(int *));
    for (i = 0; i < n; i++) {
        memo[i] = (int *)calloc(target + 1, sizeof(int));
        seen[i] = (int *)calloc(target + 1, sizeof(int));
    }
    ans = combGo(candidates, n, 0, target, memo, seen);
    for (i = 0; i < n; i++) {
        free(memo[i]);
        free(seen[i]);
    }
    free(memo);
    free(seen);
    return ans;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n * target)",
          space: "O(target)",
          why: "Unbounded knapsack ways. Outer loop is the coin, inner loop walks sums upward so that coin may be reused. That order counts combinations, not permutations. One row of size target+1. If you swapped the loops, you would count ordered sequences instead.",
          code: `function combinationSum(candidates, target) {
  const ways = Array(target + 1).fill(0);
  ways[0] = 1;
  for (let i = 0; i < candidates.length; i++) {
    const coin = candidates[i];
    for (let s = coin; s <= target; s++) {
      ways[s] += ways[s - coin];
    }
  }
  return ways[target];
}`,
          codes: {
            javascript: `function combinationSum(candidates, target) {
  const ways = Array(target + 1).fill(0);
  ways[0] = 1;
  for (let i = 0; i < candidates.length; i++) {
    const coin = candidates[i];
    for (let s = coin; s <= target; s++) {
      ways[s] += ways[s - coin];
    }
  }
  return ways[target];
}`,
            python: `def combinationSum(candidates, target):
    ways = [0] * (target + 1)
    ways[0] = 1
    for coin in candidates:
        for s in range(coin, target + 1):
            ways[s] += ways[s - coin]
    return ways[target]`,
            java: `class Solution {
    public int combinationSum(int[] candidates, int target) {
        int[] ways = new int[target + 1];
        ways[0] = 1;
        for (int i = 0; i < candidates.length; i++) {
            int coin = candidates[i];
            for (int s = coin; s <= target; s++) {
                ways[s] += ways[s - coin];
            }
        }
        return ways[target];
    }
}`,
            cpp: `int combinationSum(vector<int>& candidates, int target) {
    vector<int> ways(target + 1, 0);
    ways[0] = 1;
    for (int i = 0; i < (int)candidates.size(); i++) {
        int coin = candidates[i];
        for (int s = coin; s <= target; s++) ways[s] += ways[s - coin];
    }
    return ways[target];
}`,
            c: `int combinationSum(int *candidates, int n, int target) {
    int *ways = (int *)calloc(target + 1, sizeof(int));
    int i, s, ans;
    ways[0] = 1;
    for (i = 0; i < n; i++) {
        int coin = candidates[i];
        for (s = coin; s <= target; s++) ways[s] += ways[s - coin];
    }
    ans = ways[target];
    free(ways);
    return ans;
}`
          }
        }
      ]
    }
  ]
};
