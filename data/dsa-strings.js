window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-strings"] = {
  kind: "dsa",
  notes: [
    {
      title: "Strings are arrays of characters",
      body: "In JavaScript a string is immutable: s[i] = \"x\" does nothing useful. You read s[i] or s.charAt(i), you never overwrite a slot. If you need in-place edits, split to an array of characters, edit, then join. Length is s.length. Empty string is \"\"."
    },
    {
      title: "Two pointers on a string",
      body: "Palindrome checks put left at 0 and right at the last index. Move both inward while the characters match. Skip non-letters when the problem says to ignore punctuation. Valid Palindrome II uses the same walk and, at the first mismatch, tries skipping left or skipping right once."
    },
    {
      title: "Sliding window on characters",
      body: "right grows the window. A map or count array tracks what is inside. When a rule breaks (a repeat, too many replacements needed), move left until the window is valid again. Longest Substring Without Repeating Characters, Minimum Window Substring, and Permutation in String are this family."
    },
    {
      title: "Anagrams share a count signature",
      body: "Two words are anagrams if they use the same letters the same number of times. Sorting both is easy and O(k log k) per word. A 26-slot count array (or a map for unicode) is O(k). Group Anagrams uses the sorted word or the count tuple as a map key."
    },
    {
      title: "Palindromes expand from a center",
      body: "Every palindrome has a center: one character (odd length) or a gap between two characters (even length). Expand left and right while s[left] === s[right]. There are 2n-1 centers, and each expansion is O(n), so O(n²). Manacher’s algorithm gets O(n) with a transformed string and a radius array."
    },
    {
      title: "Stack for brackets",
      body: "A stack remembers the last unmatched opener. On a closer, the top must be the matching opener. If the stack is empty at the end, the string is valid. The same idea shows up in decode-string problems. Do not try to pair with two pointers; order matters: \"([)]\" is invalid."
    },
    {
      title: "Prefix of many strings",
      body: "The longest common prefix cannot be longer than the shortest word. Compare vertically (column 0 of every word, then column 1) and stop at the first mismatch. Sorting and comparing only the first and last words also works, because those two are the most different after order."
    },
    {
      title: "Length-prefix encoding",
      body: "Joining words with a rare character fails when that character appears in a word. Encode each piece as length, then \"#\", then the raw bytes. Decode by reading digits until \"#\", then slicing that many characters. That is the Encode and Decode Strings pattern."
    },
    {
      title: "KMP is prefix tables",
      body: "Naive search tries the needle at every haystack index: O(n*m). KMP builds an lps array: lps[i] is the longest proper prefix of needle[0..i] that is also a suffix. On a mismatch you jump using lps instead of starting over. Build is O(m), search is O(n)."
    },
    {
      title: "Count letters, then decide",
      body: "Many string problems only need frequencies. Longest Palindrome (the length version) adds every even count and at most one odd count (the center). Roman numerals need a map of letter values. Integer to Roman is a greedy table of value/symbol pairs from large to small."
    }
  ],
  examples: [
    {
      lang: "js",
      title: "Two pointers palindrome",
      desc: "What this is\nLeft and right walk toward the middle. The string is a palindrome if every pair matches.\nThis ignores nothing: every character counts.\n\nWhat the code is doing\ns is the input text.\nleft starts at 0, right at the last index.\nIf s[left] !== s[right], return false.\nIf the pointers meet, every pair matched.\n\nWatch out\nThis is case-sensitive and treats spaces as characters.\nValid Palindrome on LeetCode lowercases and skips non-alphanumerics first.",
      code: `function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("race a car")); // false`,
      codes: {
        javascript: `function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) return false;
    left++;
    right--;
  }
  return true;
}

console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("race a car")); // false`,
        python: `def is_palindrome(s):
    left = 0
    right = len(s) - 1
    while left < right:
        if s[left] != s[right]: return False
        left += 1
        right -= 1
    return True

print(is_palindrome("racecar")) # True
print(is_palindrome("race a car")) # False`,
        java: `class Solution {
  public boolean isPalindrome(String s) {
    int left = 0;
    int right = s.length() - 1;
    while (left < right) {
      if (s.charAt(left) != s.charAt(right)) return false;
      left++;
      right--;
    }
    return true;
  }

  // demo System.out.println(isPalindrome("racecar")); // true
  // demo System.out.println(isPalindrome("race a car")); // false
}`,
        cpp: `// vector, unordered_map, string
bool isPalindrome(string s) {
  int left = 0;
  int right = (int)s.size() - 1;
  while (left < right) {
    if (s[left] != s[right]) return false;
    left++;
    right--;
  }
  return true;
}

cout << (isPalindrome("racecar")) << "\\n"; // true
cout << (isPalindrome("race a car")) << "\\n"; // false`,
        c: `/* pass n for array length; simple loops */
int isPalindrome(char* s) {
  int left = 0;
  int right = strlen(s) - 1;
  while (left < right) {
    if (s[left] != s[right]) return 0;
    left++;
    right--;
  }
  return 1;
}

printf("%d\\n", isPalindrome("racecar")); // 1
printf("%d\\n", isPalindrome("race a car")); // 0`
      }
    },
    {
      lang: "js",
      title: "Sliding window without repeats",
      desc: "What this is\nA window [left, right] holds unique characters. lastIndex remembers where each character was last seen.\nWhen a repeat falls inside the window, left jumps past it.\n\nWhat the code is doing\nright walks every index.\nIf s[right] was seen at an index >= left, move left to that index + 1.\nbest is the max window length.\n\nWatch out\nStore the last index, not just a Set, so you can jump left in O(1).\nA Set plus while-loop delete is also correct, a bit more moving.",
      code: `function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) {
      left = last.get(ch) + 1;
    }
    last.set(ch, right);
    const len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}

console.log(lengthOfLongestSubstring("abcabcbb")); // 3`,
      codes: {
        javascript: `function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) {
      left = last.get(ch) + 1;
    }
    last.set(ch, right);
    const len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}

console.log(lengthOfLongestSubstring("abcabcbb")); // 3`,
        python: `def length_of_longest_substring(s):
    last = {}
    left = 0
    best = 0
    for right in range(len(s)):

        ch = s[right]
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        length = right - left + 1
        if length > best: best = length

    return best

print(length_of_longest_substring("abcabcbb")) # 3`,
        java: `class Solution {
  public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int left = 0;
    int best = 0;
    for (int right = 0; right < s.length(); right++) {
      char ch = s.charAt(right);
      if (last.containsKey(ch) && last.get(ch) >= left) {
        left = last.get(ch) + 1;
      }
      last.put(ch, right);
      int len = right - left + 1;
      if (len > best) best = len;
    }
    return best;
  }

  // demo System.out.println(lengthOfLongestSubstring("abcabcbb")); // 3
}`,
        cpp: `// vector, unordered_map, string
int lengthOfLongestSubstring(string s) {
  unordered_map<int,int> last;
  int left = 0;
  int best = 0;
  for (int right = 0; right < (int)s.size(); right++) {
    char ch = s[right];
    if (last.count(ch) && last[ch] >= left) {
      left = last[ch] + 1;
    }
    last[ch] = right;
    int len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}

cout << (lengthOfLongestSubstring("abcabcbb")) << "\\n"; // 3`,
        c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int lengthOfLongestSubstring(char* s) {
  int last_keys[1024]; int last_vals[1024]; int last_n = 0;
  int left = 0;
  int best = 0;
  for (int right = 0; right < strlen(s); right++) {
    int ch = s[right];
    if (map_find(last_keys, last_n, ch) >= 0 && last.get(ch) >= left) {
      left = last.get(ch) + 1;
    }
    /* set last */;
    int len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}

printf("%d\\n", lengthOfLongestSubstring("abcabcbb")); // 3`
      }
    },
    {
      lang: "js",
      title: "Anagram check with counts",
      desc: "What this is\nTwo strings are anagrams if their letter counts match.\nA 26-slot array is enough for lowercase a-z.\n\nWhat the code is doing\nIf lengths differ, they cannot be anagrams.\nWalk s and add 1 for each letter. Walk t and subtract 1.\nIf every slot ends at 0, the counts matched.\n\nWatch out\nThis version assumes lowercase English letters.\nFor unicode, use a Map instead of 26 slots.",
      code: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  for (let i = 0; i < 26; i++) {
    if (count[i] !== 0) return false;
  }
  return true;
}

console.log(isAnagram("anagram", "nagaram")); // true`,
      codes: {
        javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  for (let i = 0; i < 26; i++) {
    if (count[i] !== 0) return false;
  }
  return true;
}

console.log(isAnagram("anagram", "nagaram")); // true`,
        python: `def is_anagram(s, t):
    if len(s) != len(t): return False
    count = [0] * 26
    for i in range(len(s)):

        count[ord(s[i]) - 97]++
        count[ord(t[i]) - 97]--

    for i in range(26):

        if count[i] != 0: return False

    return True

print(is_anagram("anagram", "nagaram")) # True`,
        java: `class Solution {
  public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
      count[(int)s.charAt(i) - 97]++;
      count[(int)t.charAt(i) - 97]--;
    }
    for (int i = 0; i < 26; i++) {
      if (count[i] != 0) return false;
    }
    return true;
  }

  // demo System.out.println(isAnagram("anagram", "nagaram")); // true
}`,
        cpp: `// vector, unordered_map, string
bool isAnagram(string s, string t) {
  if ((int)s.size() != (int)t.size()) return false;
  vector<int> count = vector<int>(26, 0);
  for (int i = 0; i < (int)s.size(); i++) {
    count[(int)s[i] - 97]++;
    count[(int)t[i] - 97]--;
  }
  for (int i = 0; i < 26; i++) {
    if (count[i] != 0) return false;
  }
  return true;
}

cout << (isAnagram("anagram", "nagaram")) << "\\n"; // true`,
        c: `/* pass n for array length; simple loops */
int isAnagram(char* s, char* t) {
  if (strlen(s) != strlen(t)) return 0;
  int count = /* zeros 26 */;
  for (int i = 0; i < strlen(s); i++) {
    count[(int)s[i] - 97]++;
    count[(int)t[i] - 97]--;
  }
  for (int i = 0; i < 26; i++) {
    if (count[i] != 0) return 0;
  }
  return 1;
}

printf("%d\\n", isAnagram("anagram", "nagaram")); // 1`
      }
    },
    {
      lang: "js",
      title: "Expand around palindrome centers",
      desc: "What this is\nA palindrome grows from a middle. Odd length uses one center index. Even length uses a center between two indexes.\n\nWhat the code is doing\nexpand(l, r) walks outward while the letters match and returns the slice.\nFor each i we try center i and center i, i+1.\nbest keeps the longest slice seen.\n\nWatch out\nDo not skip even-length centers or you miss \"abba\".\nThis is O(n²), which is the usual interview target.",
      code: `function longestPalindrome(s) {
  let best = "";

  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return s.slice(left + 1, right);
  }

  for (let i = 0; i < s.length; i++) {
    const odd = expand(i, i);
    const even = expand(i, i + 1);
    if (odd.length > best.length) best = odd;
    if (even.length > best.length) best = even;
  }
  return best;
}

console.log(longestPalindrome("babad")); // bab or aba`,
      codes: {
        javascript: `function longestPalindrome(s) {
  let best = "";

  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      left--;
      right++;
    }
    return s.slice(left + 1, right);
  }

  for (let i = 0; i < s.length; i++) {
    const odd = expand(i, i);
    const even = expand(i, i + 1);
    if (odd.length > best.length) best = odd;
    if (even.length > best.length) best = even;
  }
  return best;
}

console.log(longestPalindrome("babad")); // bab or aba`,
        python: `def longest_palindrome(s):
    best = ""

    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]

    for i in range(len(s)):

        odd = expand(i, i)
        even = expand(i, i + 1)
        if len(odd) > len(best): best = odd
        if len(even) > len(best): best = even

    return best

print(longest_palindrome("babad")) # bab or aba`,
        java: `class Solution {
  public String longestPalindrome(String s) {
    String best = "";

    public void expand(left, right) {
      while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
      }
      return s.substring(left + 1, right);
    }

    for (int i = 0; i < s.length(); i++) {
      int odd = expand(i, i);
      int even = expand(i, i + 1);
      if (odd.length > best.length()) best = odd;
      if (even.length > best.length()) best = even;
    }
    return best;
  }

  // demo System.out.println(longestPalindrome("babad")); // bab or aba
}`,
        cpp: `// vector, unordered_map, string
string longestPalindrome(string s) {
  string best = "";

  auto expand = [&](left, right) {
    while (left >= 0 && right < (int)s.size() && s[left] == s[right]) {
      left--;
      right++;
    }
    return s.substr(left + 1, (right)-(left + 1));
  }

  for (int i = 0; i < (int)s.size(); i++) {
    int odd = expand(i, i);
    int even = expand(i, i + 1);
    if ((int)odd.size() > (int)best.size()) best = odd;
    if ((int)even.size() > (int)best.size()) best = even;
  }
  return best;
}

cout << (longestPalindrome("babad")) << "\\n"; // bab or aba`,
        c: `/* pass n for array length; simple loops */
void longestPalindrome(char* s, char* out) {
  char best[1024]; /* "" */

  void expand(/* left, right */) {
    while (left >= 0 && right < strlen(s) && s[left] == s[right]) {
      left--;
      right++;
    }
    return /* slice s */;
  }

  for (int i = 0; i < strlen(s); i++) {
    int odd = expand(i, i);
    int even = expand(i, i + 1);
    if (odd_len > strlen(best)) best = odd;
    if (even_len > strlen(best)) best = even;
  }
  return best;
}

printf("%d\\n", longestPalindrome("babad")); // bab or aba`
      }
    },
    {
      lang: "js",
      title: "Stack for matching brackets",
      desc: "What this is\nOpeners go on a stack. A closer must match the most recent opener.\nThe string is valid only if the stack is empty at the end.\n\nWhat the code is doing\npairs maps each closer to its opener.\nOn \"(\" \"[\" \"{\" we push.\nOn a closer, pop and compare. Empty stack or a mismatch fails.\n\nWatch out\n\"([)]\" fails because the top is \"[\" when we see \")\".\nA leftover opener at the end is also invalid: \"((\".",
      code: `function isValid(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}

console.log(isValid("()[]{}")); // true
console.log(isValid("([)]")); // false`,
      codes: {
        javascript: `function isValid(s) {
  const stack = [];
  const pairs = { ")": "(", "]": "[", "}": "{" };
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}

console.log(isValid("()[]{}")); // true
console.log(isValid("([)]")); // false`,
        python: `def is_valid(s):
    stack = []
    pairs = { ")": "(", "]": "[", "}": "{" }
    for i in range(len(s)):

        ch = s[i]
        if ch == "(" or ch == "[" or ch == "{":
            stack.append(ch)
        else:
            if stack.pop() != pairs[ch]: return False

    return len(stack) == 0

print(is_valid("()[]{}")) # True
print(is_valid("([)]")) # False`,
        java: `class Solution {
  public boolean isValid(String s) {
    List<Integer> stack = new ArrayList<>();
    int pairs = { ")": "(", "]": "[", "}": "{" };
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i);
      if (ch == "(" || ch == "[" || ch == "{") {
        stack.add(ch);
      } else {
        if (stack.remove(stack.size()() - 1) != pairs[ch]) return false;
      }
    }
    return stack.size() == 0;
  }

  // demo System.out.println(isValid("()[]{}")); // true
  // demo System.out.println(isValid("([)]")); // false
}`,
        cpp: `// vector, unordered_map, string
bool isValid(string s) {
  vector<int> stack;
  int pairs = { ")": "(", "]": "[", "}": "{" };
  for (int i = 0; i < (int)s.size(); i++) {
    char ch = s[i];
    if (ch == "(" || ch == "[" || ch == "{") {
      stack.push_back(ch);
    } else {
      if (({ auto _t=stack.back(); stack.pop_back(); _t; }) != pairs[ch]) return false;
    }
  }
  return (int)stack.size() == 0;
}

cout << (isValid("()[]{}")) << "\\n"; // true
cout << (isValid("([)]")) << "\\n"; // false`,
        c: `/* pass n for array length; simple loops */
int isValid(char* s) {
  int stack[1024]; int stack_n = 0;
  int pairs = { ")": "(", "]": "[", "}": "{" };
  for (int i = 0; i < strlen(s); i++) {
    int ch = s[i];
    if (ch == "(" || ch == "[" || ch == "{") {
      /* push */(ch);
    } else {
      if (/* pop */ != pairs[ch]) return 0;
    }
  }
  return stack_len == 0;
}

printf("%d\\n", isValid("()[]{}")); // 1
printf("%d\\n", isValid("([)]")); // 0`
      }
    },
    {
      lang: "js",
      title: "Length-prefix encode / decode",
      desc: "What this is\nEach string is stored as its length, a \"#\", then the raw text.\nDecode reads digits until \"#\", then slices that many characters.\n\nWhat the code is doing\nencode walks the list and concatenates length + \"#\" + word.\ndecode uses index i. j finds the next \"#\". Number(s.slice(i, j)) is the length.\nThen the word is the next len characters.\n\nWatch out\nDo not join with a delimiter that can appear inside a word.\nLengths can be more than one digit, so scan until \"#\", do not assume one digit.",
      code: `function encode(strs) {
  let out = "";
  for (let i = 0; i < strs.length; i++) {
    out += String(strs[i].length) + "#" + strs[i];
  }
  return out;
}

function decode(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    let j = i;
    while (s[j] !== "#") j++;
    const len = Number(s.slice(i, j));
    out.push(s.slice(j + 1, j + 1 + len));
    i = j + 1 + len;
  }
  return out;
}

const packed = encode(["hi", "a#b"]);
console.log(packed);
console.log(decode(packed)); // ["hi", "a#b"]`,
      codes: {
        javascript: `function encode(strs) {
  let out = "";
  for (let i = 0; i < strs.length; i++) {
    out += String(strs[i].length) + "#" + strs[i];
  }
  return out;
}

function decode(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    let j = i;
    while (s[j] !== "#") j++;
    const len = Number(s.slice(i, j));
    out.push(s.slice(j + 1, j + 1 + len));
    i = j + 1 + len;
  }
  return out;
}

const packed = encode(["hi", "a#b"]);
console.log(packed);
console.log(decode(packed)); // ["hi", "a#b"]`,
        python: `def encode(strs):
    out = ""
    for i in range(len(strs)):

        out += str(strs[i].length) + "#" + strs[i]

    return out

def decode(s):
    out = []
    i = 0
    while i < len(s):
        j = i
        while s[j] != "#": j += 1
        length = int(s[i:j])
        out.append(s[j + 1:j + 1 + length])
        i = j + 1 + length
    return out

packed = encode(["hi", "a#b"])
print(packed)
print(decode(packed)) # ["hi", "a#b"]`,
        java: `class Solution {
  public String encode(String[] strs) {
    String out = "";
    for (int i = 0; i < strs.length; i++) {
      out += String.valueOf(strs[i].length) + "#" + strs[i];
    }
    return out;
  }

  public List<String> decode(String s) {
    List<Integer> out = new ArrayList<>();
    int i = 0;
    while (i < s.length()) {
      int j = i;
      while (s.charAt(j) != "#") j++;
      String len = Integer.parseInt(s.substring(i, j));
      out.add(s.substring(j + 1, j + 1 + len));
      i = j + 1 + len;
    }
    return out;
  }

  int packed = encode(["hi", "a#b"]);
  // demo System.out.println(packed);
  // demo System.out.println(decode(packed)); // ["hi", "a#b"]
}`,
        cpp: `// vector, unordered_map, string
string encode(vector<string>& strs) {
  string out = "";
  for (int i = 0; i < (int)strs.size(); i++) {
    out += to_string(strs[i].length) + "#" + strs[i];
  }
  return out;
}

vector<string> decode(string s) {
  vector<int> out;
  int i = 0;
  while (i < (int)s.size()) {
    int j = i;
    while (s[j] != "#") j++;
    string len = stoi(s.substr(i, (j)-(i)));
    out.push_back(s.substr(j + 1, (j + 1 + len)-(j + 1)));
    i = j + 1 + len;
  }
  return out;
}

int packed = encode(["hi", "a#b"]);
cout << (packed) << "\\n";
cout << (decode(packed)) << "\\n"; // ["hi", "a#b"]`,
        c: `/* pass n for array length; simple loops */
void encode(char strs[][128], int n, char* out) {
  char out[1024]; /* "" */
  for (int i = 0; i < n; i++) {
    out += strs[i].length + "#" + strs[i];
  }
  return out;
}

int decode(char* s, char out[][128]) {
  int out[1024]; int out_n = 0;
  int i = 0;
  while (i < strlen(s)) {
    int j = i;
    while (s[j] != "#") j++;
    char len[1024]; /* atoi(/* slice s */) */
    /* push */(/* slice s */);
    i = j + 1 + len;
  }
  return out;
}

int packed = encode(["hi", "a#b"]);
printf("%d\\n", packed);
printf("%d\\n", decode(packed)); // ["hi", "a#b"]`
      }
    },
    {
      lang: "js",
      title: "Prefix count for a window (need / have)",
      desc: "What this is\nneed maps required character counts (from t). have maps what the current window holds.\nformed is how many unique characters already meet their need.\n\nWhat the code is doing\nright adds s[right] into have.\nWhen have[ch] hits need[ch], formed increases.\nWhile formed is complete, shrink left and record the smallest window.\n\nWatch out\nCompare have to need with a formed counter, not a full map scan every step.\nMissing this is what makes min-window feel O(n²).",
      code: `function minWindow(s, t) {
  if (t.length > s.length) return "";
  const need = new Map();
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    need.set(ch, (need.get(ch) || 0) + 1);
  }
  const have = new Map();
  let formed = 0;
  const needCount = need.size;
  let best = "";
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    have.set(ch, (have.get(ch) || 0) + 1);
    if (need.has(ch) && have.get(ch) === need.get(ch)) formed++;
    while (formed === needCount) {
      const slice = s.slice(left, right + 1);
      if (best === "" || slice.length < best.length) best = slice;
      const drop = s[left];
      have.set(drop, have.get(drop) - 1);
      if (need.has(drop) && have.get(drop) < need.get(drop)) formed--;
      left++;
    }
  }
  return best;
}

console.log(minWindow("ADOBECODEBANC", "ABC")); // BANC`,
      codes: {
        javascript: `function minWindow(s, t) {
  if (t.length > s.length) return "";
  const need = new Map();
  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    need.set(ch, (need.get(ch) || 0) + 1);
  }
  const have = new Map();
  let formed = 0;
  const needCount = need.size;
  let best = "";
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    have.set(ch, (have.get(ch) || 0) + 1);
    if (need.has(ch) && have.get(ch) === need.get(ch)) formed++;
    while (formed === needCount) {
      const slice = s.slice(left, right + 1);
      if (best === "" || slice.length < best.length) best = slice;
      const drop = s[left];
      have.set(drop, have.get(drop) - 1);
      if (need.has(drop) && have.get(drop) < need.get(drop)) formed--;
      left++;
    }
  }
  return best;
}

console.log(minWindow("ADOBECODEBANC", "ABC")); // BANC`,
        python: `def min_window(s, t):
    if len(t) > len(s): return ""
    need = {}
    for i in range(len(t)):

        ch = t[i]
        need[ch] = need.get(ch, 0 + 1)

    have = {}
    formed = 0
    needCount = len(need)
    best = ""
    left = 0
    for right in range(len(s)):

        ch = s[right]
        have[ch] = have.get(ch, 0 + 1)
        if ch in need and have[ch] == need[ch]: formed += 1
        while formed == needCount:
            slice = s[left:right + 1]
            if best == "" or len(slice) < len(best): best = slice
            drop = s[left]
            have[drop] = have.get(drop - 1)
            if drop in need and have[drop] < need[drop]: formed -= 1
            left += 1

    return best

print(min_window("ADOBECODEBANC", "ABC")) # BANC`,
        java: `class Solution {
  public String minWindow(String s, String t) {
    if (t.length() > s.length()) return "";
    Map<Character, Integer> need = new HashMap<>();
    for (int i = 0; i < t.length(); i++) {
      char ch = t.charAt(i);
      need.put(ch, (need.getOrDefault(ch, 0)) + 1);
    }
    Map<Character, Integer> have = new HashMap<>();
    int formed = 0;
    int needCount = need.size();
    String best = "";
    int left = 0;
    for (int right = 0; right < s.length(); right++) {
      char ch = s.charAt(right);
      have.put(ch, (have.getOrDefault(ch, 0)) + 1);
      if (need.containsKey(ch) && have.get(ch) == need.get(ch)) formed++;
      while (formed == needCount) {
        String slice = s.substring(left, right + 1);
        if (best == "" || slice.length() < best.length()) best = slice;
        char drop = s.charAt(left);
        have.put(drop, have.get(drop) - 1);
        if (need.containsKey(drop) && have.get(drop) < need.get(drop)) formed--;
        left++;
      }
    }
    return best;
  }

  // demo System.out.println(minWindow("ADOBECODEBANC", "ABC")); // BANC
}`,
        cpp: `// vector, unordered_map, string
string minWindow(string s, string t) {
  if ((int)t.size() > (int)s.size()) return "";
  unordered_map<int,int> need;
  for (int i = 0; i < (int)t.size(); i++) {
    char ch = t[i];
    need[ch] = (need.count(ch ? need[ch] : 0) + 1);
  }
  unordered_map<int,int> have;
  int formed = 0;
  int needCount = need.size();
  string best = "";
  int left = 0;
  for (int right = 0; right < (int)s.size(); right++) {
    char ch = s[right];
    have[ch] = (have.count(ch ? have[ch] : 0) + 1);
    if (need.count(ch) && have[ch] == need[ch]) formed++;
    while (formed == needCount) {
      string slice = s.substr(left, (right + 1)-(left));
      if (best == "" || (int)slice.size() < (int)best.size()) best = slice;
      char drop = s[left];
      have[drop] = have[drop] - 1;
      if (need.count(drop) && have[drop] < need[drop]) formed--;
      left++;
    }
  }
  return best;
}

cout << (minWindow("ADOBECODEBANC", "ABC")) << "\\n"; // BANC`,
        c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
void minWindow(char* s, char* t, char* out) {
  if (strlen(t) > strlen(s)) return "";
  int need_keys[1024]; int need_vals[1024]; int need_n = 0;
  for (int i = 0; i < strlen(t); i++) {
    int ch = t[i];
    /* set need */ + 1);
  }
  int have_keys[1024]; int have_vals[1024]; int have_n = 0;
  int formed = 0;
  int needCount = need_n;
  char best[1024]; /* "" */
  int left = 0;
  for (int right = 0; right < strlen(s); right++) {
    int ch = s[right];
    /* set have */ + 1);
    if (map_find(need_keys, need_n, ch) >= 0 && have.get(ch) == need.get(ch)) formed++;
    while (formed == needCount) {
      char slice[1024]; /* /* slice s */ */
      if (best == "" || strlen(slice) < strlen(best)) best = slice;
      int drop = s[left];
      /* set have */ - 1);
      if (map_find(need_keys, need_n, drop) >= 0 && have.get(drop) < need.get(drop)) formed--;
      left++;
    }
  }
  return best;
}

printf("%d\\n", minWindow("ADOBECODEBANC", "ABC")); // BANC`
      }
    },
    {
      lang: "js",
      title: "Vertical longest common prefix",
      desc: "What this is\nCompare the same column across every word. Stop at the first mismatch or when a word runs out.\n\nWhat the code is doing\nfirst is strs[0]. For each column i, every other word must have that character.\nIf some word is shorter than i+1, or disagrees, return first.slice(0, i).\nIf the loop finishes, the whole first word is the prefix.\n\nWatch out\nAn empty list should return \"\".\nOne empty word makes the prefix empty immediately.",
      code: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  const first = strs[0];
  for (let i = 0; i < first.length; i++) {
    const ch = first[i];
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== ch) {
        return first.slice(0, i);
      }
    }
  }
  return first;
}

console.log(longestCommonPrefix(["flower", "flow", "flight"])); // fl`,
      codes: {
        javascript: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  const first = strs[0];
  for (let i = 0; i < first.length; i++) {
    const ch = first[i];
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== ch) {
        return first.slice(0, i);
      }
    }
  }
  return first;
}

console.log(longestCommonPrefix(["flower", "flow", "flight"])); // fl`,
        python: `def longest_common_prefix(strs):
    if not len(strs): return ""
    first = strs[0]
    for i in range(len(first)):

        ch = first[i]
        for j in range(1, len(strs)):

            if i >= strs[j].length or strs[j][i] != ch:
                return first[0:i]

    return first

print(longest_common_prefix(["flower", "flow", "flight"])) # fl`,
        java: `class Solution {
  public String longestCommonPrefix(String[] strs) {
    if (!strs.length) return "";
    String first = strs[0];
    for (int i = 0; i < first.length(); i++) {
      char ch = first.charAt(i);
      for (int j = 1; j < strs.length; j++) {
        if (i >= strs[j].length || strs[j][i] != ch) {
          return first.substring(0, i);
        }
      }
    }
    return first;
  }

  // demo System.out.println(longestCommonPrefix(["flower", "flow", "flight"])); // fl
}`,
        cpp: `// vector, unordered_map, string
string longestCommonPrefix(vector<string>& strs) {
  if (!(int)strs.size()) return "";
  string first = strs[0];
  for (int i = 0; i < (int)first.size(); i++) {
    char ch = first[i];
    for (int j = 1; j < (int)strs.size(); j++) {
      if (i >= strs[j].length || strs[j][i] != ch) {
        return first.substr(0, (i)-(0));
      }
    }
  }
  return first;
}

cout << (longestCommonPrefix(["flower", "flow", "flight"])) << "\\n"; // fl`,
        c: `/* pass n for array length; simple loops */
void longestCommonPrefix(char strs[][64], int n, char* out) {
  if (!n) return "";
  char first[1024]; /* strs[0] */
  for (int i = 0; i < strlen(first); i++) {
    int ch = first[i];
    for (int j = 1; j < n; j++) {
      if (i >= strs[j].length || strs[j][i] != ch) {
        return /* slice first */;
      }
    }
  }
  return first;
}

printf("%d\\n", longestCommonPrefix(["flower", "flow", "flight"])); // fl`
      }
    },
    {
      lang: "js",
      title: "Character counts for palindrome length",
      desc: "What this is\nA palindrome can use every even count of a letter, and at most one odd leftover as the center.\nThis returns the length, not the string.\n\nWhat the code is doing\ncount[ch] tallies each character.\nFor each count, add count - (count % 2) to the length (the even part).\nIf any count was odd, add 1 at the end for the center.\n\nWatch out\nUppercase and lowercase are different keys unless you lowercase first.\nThe problem \"Longest Palindrome\" on LeetCode is this length version.",
      code: `function longestPalindromeLength(s) {
  const count = {};
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    count[ch] = (count[ch] || 0) + 1;
  }
  let len = 0;
  let odd = false;
  for (const ch in count) {
    len += count[ch] - (count[ch] % 2);
    if (count[ch] % 2 === 1) odd = true;
  }
  return odd ? len + 1 : len;
}

console.log(longestPalindromeLength("abccccdd")); // 7`,
      codes: {
        javascript: `function longestPalindromeLength(s) {
  const count = {};
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    count[ch] = (count[ch] || 0) + 1;
  }
  let len = 0;
  let odd = false;
  for (const ch in count) {
    len += count[ch] - (count[ch] % 2);
    if (count[ch] % 2 === 1) odd = true;
  }
  return odd ? len + 1 : len;
}

console.log(longestPalindromeLength("abccccdd")); // 7`,
        python: `def longest_palindrome_length(s):
    count = {}
    for i in range(len(s)):

        ch = s[i]
        count[ch] = (count[ch] or 0) + 1

    length = 0
    odd = False
    for ch in count:
        length += count[ch] - (count[ch] % 2)
        if count[ch] % 2 == 1: odd = True
    length + 1 if return odd else length

print(longest_palindrome_length("abccccdd")) # 7`,
        java: `class Solution {
  public int longestPalindromeLength(String s) {
    int count = {};
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i);
      count[ch] = (count[ch] || 0) + 1;
    }
    int len = 0;
    boolean odd = false;
    for (var ch : count) {
      len += count[ch] - (count[ch] % 2);
      if (count[ch] % 2 == 1) odd = true;
    }
    return odd ? len + 1 : len;
  }

  // demo System.out.println(longestPalindromeLength("abccccdd")); // 7
}`,
        cpp: `// vector, unordered_map, string
int longestPalindromeLength(string s) {
  unordered_map<int,int> count;
  for (int i = 0; i < (int)s.size(); i++) {
    char ch = s[i];
    count[ch] = (count[ch] || 0) + 1;
  }
  int len = 0;
  bool odd = false;
  for (auto ch : count) {
    len += count[ch] - (count[ch] % 2);
    if (count[ch] % 2 == 1) odd = true;
  }
  return odd ? len + 1 : len;
}

cout << (longestPalindromeLength("abccccdd")) << "\\n"; // 7`,
        c: `/* pass n for array length; simple loops */
int longestPalindromeLength(char* s) {
  int count = {};
  for (int i = 0; i < strlen(s); i++) {
    int ch = s[i];
    count[ch] = (count[ch] || 0) + 1;
  }
  int len = 0;
  int odd = 0;
  for (auto ch : count) {
    len += count[ch] - (count[ch] % 2);
    if (count[ch] % 2 == 1) odd = 1;
  }
  return odd ? len + 1 : len;
}

printf("%d\\n", longestPalindromeLength("abccccdd")); // 7`
      }
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "Valid Anagram",
      ask: "Amazon · Google · Meta · Adobe",
      a: "Return true if t is an anagram of s: same letters with the same counts, order does not matter.\n\nExample: s = \"anagram\", t = \"nagaram\" is true. s = \"rat\", t = \"car\" is false.\n\nYou can delete matching letters one by one. Sorting both strings and comparing is cleaner. One 26-slot count array increments for s and decrements for t.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "For each letter in s you search t and splice it out. Each splice is O(n), so quadratic.\nHow it works: copy t into an array. For every character of s, indexOf that character in the copy; if missing, false; else splice it out. Empty copy at the end means success.",
          code: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const letters = t.split("");
  for (let i = 0; i < s.length; i++) {
    const idx = letters.indexOf(s[i]);
    if (idx === -1) return false;
    letters.splice(idx, 1);
  }
  return letters.length === 0;
}`,
          codes: {
            javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const letters = t.split("");
  for (let i = 0; i < s.length; i++) {
    const idx = letters.indexOf(s[i]);
    if (idx === -1) return false;
    letters.splice(idx, 1);
  }
  return letters.length === 0;
}`,
            python: `def is_anagram(s, t):
    if len(s) != len(t): return False
    letters = list(t)
    for i in range(len(s)):

        idx = letters.find(s[i]) if isinstance(letters, str) else (letters.index(s[i]) if s[i] in letters else -1)
        if idx == -1: return False
        del letters[idx]

    return len(letters) == 0`,
            java: `class Solution {
  public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int letters = t.split("");
    for (int i = 0; i < s.length(); i++) {
      int idx = letters.indexOf(s.charAt(i));
      if (idx == -1) return false;
      letters.remove((int)(idx));
    }
    return letters.length == 0;
  }
}`,
            cpp: `// vector, unordered_map, string
bool isAnagram(string s, string t) {
  if ((int)s.size() != (int)t.size()) return false;
  int letters = /* split t */;
  for (int i = 0; i < (int)s.size(); i++) {
    int idx = (int)letters.find(s[i]);
    if (idx == -1) return false;
    letters.erase(letters.begin()+(idx));
  }
  return (int)letters.size() == 0;
}`,
            c: `/* pass n for array length; simple loops */
int isAnagram(char* s, char* t) {
  if (strlen(s) != strlen(t)) return 0;
  int letters = /* split t */;
  for (int i = 0; i < strlen(s); i++) {
    int idx = /* indexOf */;
    if (idx == -1) return 0;
    /* erase */;
  }
  return letters_len == 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(n)",
          why: "Sorting both strings dominates. Extra arrays hold the split characters.\nHow it works: sort the character lists and compare them index by index.",
          code: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const a = s.split("").sort();
  const b = t.split("").sort();
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}`,
          codes: {
            javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const a = s.split("").sort();
  const b = t.split("").sort();
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}`,
            python: `def is_anagram(s, t):
    if len(s) != len(t): return False
    a = list(s).sort()
    b = list(t).sort()
    for i in range(len(a)):

        if a[i] != b[i]: return False

    return True`,
            java: `class Solution {
  public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int a = s.split("").sort();
    int b = t.split("").sort();
    for (int i = 0; i < a.length; i++) {
      if (a[i] != b[i]) return false;
    }
    return true;
  }
}`,
            cpp: `// vector, unordered_map, string
bool isAnagram(string s, string t) {
  if ((int)s.size() != (int)t.size()) return false;
  int a = /* split s */.sort();
  int b = /* split t */.sort();
  for (int i = 0; i < (int)a.size(); i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}`,
            c: `/* pass n for array length; simple loops */
int isAnagram(char* s, char* t) {
  if (strlen(s) != strlen(t)) return 0;
  int a = /* split s */.sort();
  int b = /* split t */.sort();
  for (int i = 0; i < a_len; i++) {
    if (a[i] != b[i]) return 0;
  }
  return 1;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "One pass over both strings and 26 integers. For lowercase a-z the extra space is constant.\nHow it works: count[s[i]]++, count[t[i]]--. If every slot is 0, the bags of letters matched.",
          code: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  for (let i = 0; i < 26; i++) {
    if (count[i] !== 0) return false;
  }
  return true;
}`,
          codes: {
            javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = new Array(26).fill(0);
  for (let i = 0; i < s.length; i++) {
    count[s.charCodeAt(i) - 97]++;
    count[t.charCodeAt(i) - 97]--;
  }
  for (let i = 0; i < 26; i++) {
    if (count[i] !== 0) return false;
  }
  return true;
}`,
            python: `def is_anagram(s, t):
    if len(s) != len(t): return False
    count = [0] * 26
    for i in range(len(s)):

        count[ord(s[i]) - 97]++
        count[ord(t[i]) - 97]--

    for i in range(26):

        if count[i] != 0: return False

    return True`,
            java: `class Solution {
  public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    int[] count = new int[26];
    for (int i = 0; i < s.length(); i++) {
      count[(int)s.charAt(i) - 97]++;
      count[(int)t.charAt(i) - 97]--;
    }
    for (int i = 0; i < 26; i++) {
      if (count[i] != 0) return false;
    }
    return true;
  }
}`,
            cpp: `// vector, unordered_map, string
bool isAnagram(string s, string t) {
  if ((int)s.size() != (int)t.size()) return false;
  vector<int> count = vector<int>(26, 0);
  for (int i = 0; i < (int)s.size(); i++) {
    count[(int)s[i] - 97]++;
    count[(int)t[i] - 97]--;
  }
  for (int i = 0; i < 26; i++) {
    if (count[i] != 0) return false;
  }
  return true;
}`,
            c: `/* pass n for array length; simple loops */
int isAnagram(char* s, char* t) {
  if (strlen(s) != strlen(t)) return 0;
  int count = /* zeros 26 */;
  for (int i = 0; i < strlen(s); i++) {
    count[(int)s[i] - 97]++;
    count[(int)t[i] - 97]--;
  }
  for (int i = 0; i < 26; i++) {
    if (count[i] != 0) return 0;
  }
  return 1;
}`
          }
        }
      ]
    },
    {
      id: 2,
      level: "beginner",
      q: "Valid Palindrome",
      ask: "Meta · Amazon · Microsoft · Apple",
      a: "A phrase is a palindrome if, after keeping only letters and digits and ignoring case, it reads the same forward and backward.\n\nExample: \"A man, a plan, a canal: Panama\" is true. \"race a car\" is false.\n\nBuilding a cleaned string and reversing it is easy. Cleaning into an array and two-pointer checking avoids reverse. The last version never builds a cleaned copy: it skips junk in place.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Linear scan, but a full cleaned copy plus a reversed copy.\nHow it works: keep [a-z0-9], lowercase, then compare the string to its reverse.",
          code: `function isPalindrome(s) {
  let cleaned = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i].toLowerCase();
    if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) cleaned += ch;
  }
  const reversed = cleaned.split("").reverse().join("");
  return cleaned === reversed;
}`,
          codes: {
            javascript: `function isPalindrome(s) {
  let cleaned = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i].toLowerCase();
    if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) cleaned += ch;
  }
  const reversed = cleaned.split("").reverse().join("");
  return cleaned === reversed;
}`,
            python: `def is_palindrome(s):
    cleaned = ""
    for i in range(len(s)):

        ch = s[i].lower()
        if (ch >= "a" and ch <= "z") or (ch >= "0" and ch <= "9"): cleaned += ch

    reversed = list(cleaned).reverse().join("")
    return cleaned == reversed`,
            java: `class Solution {
  public boolean isPalindrome(String s) {
    String cleaned = "";
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i).toLowerCase();
      if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) cleaned += ch;
    }
    int reversed = cleaned.split("").reverse().join("");
    return cleaned == reversed;
  }
}`,
            cpp: `// vector, unordered_map, string
bool isPalindrome(string s) {
  string cleaned = "";
  for (int i = 0; i < (int)s.size(); i++) {
    char ch = s[i].toLowerCase();
    if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) cleaned += ch;
  }
  int reversed = /* split cleaned */.reverse().join("");
  return cleaned == reversed;
}`,
            c: `/* pass n for array length; simple loops */
int isPalindrome(char* s) {
  char cleaned[1024]; /* "" */
  for (int i = 0; i < strlen(s); i++) {
    int ch = s[i].toLowerCase();
    if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) cleaned += ch;
  }
  int reversed = /* split cleaned */.reverse().join("");
  return cleaned == reversed;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Still a cleaned array, but comparison is two pointers instead of building a reversed string.\nHow it works: push kept characters into chars, then left/right must match.",
          code: `function isPalindrome(s) {
  const chars = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i].toLowerCase();
    if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) chars.push(ch);
  }
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    if (chars[left] !== chars[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
          codes: {
            javascript: `function isPalindrome(s) {
  const chars = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i].toLowerCase();
    if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) chars.push(ch);
  }
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    if (chars[left] !== chars[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
            python: `def is_palindrome(s):
    chars = []
    for i in range(len(s)):

        ch = s[i].lower()
        if (ch >= "a" and ch <= "z") or (ch >= "0" and ch <= "9"): chars.append(ch)

    left = 0
    right = len(chars) - 1
    while left < right:
        if chars[left] != chars[right]: return False
        left += 1
        right -= 1
    return True`,
            java: `class Solution {
  public boolean isPalindrome(String s) {
    List<Integer> chars = new ArrayList<>();
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i).toLowerCase();
      if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) chars.add(ch);
    }
    int left = 0;
    int right = chars.size() - 1;
    while (left < right) {
      if (chars[left] != chars[right]) return false;
      left++;
      right--;
    }
    return true;
  }
}`,
            cpp: `// vector, unordered_map, string
bool isPalindrome(string s) {
  vector<int> chars;
  for (int i = 0; i < (int)s.size(); i++) {
    char ch = s[i].toLowerCase();
    if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) chars.push_back(ch);
  }
  int left = 0;
  int right = (int)chars.size() - 1;
  while (left < right) {
    if (chars[left] != chars[right]) return false;
    left++;
    right--;
  }
  return true;
}`,
            c: `/* pass n for array length; simple loops */
int isPalindrome(char* s) {
  int chars[1024]; int chars_n = 0;
  for (int i = 0; i < strlen(s); i++) {
    int ch = s[i].toLowerCase();
    if ((ch >= "a" && ch <= "z") || (ch >= "0" && ch <= "9")) /* push */(ch);
  }
  int left = 0;
  int right = chars_len - 1;
  while (left < right) {
    if (chars[left] != chars[right]) return 0;
    left++;
    right--;
  }
  return 1;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "No extra string of length n. Two indexes on the original text.\nHow it works: skip non-alphanumeric on both sides, lowercase the two live characters, compare, then move in.",
          code: `function isPalindrome(s) {
  function ok(ch) {
    const c = ch.toLowerCase();
    return (c >= "a" && c <= "z") || (c >= "0" && c <= "9");
  }
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    while (left < right && !ok(s[left])) left++;
    while (left < right && !ok(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
          codes: {
            javascript: `function isPalindrome(s) {
  function ok(ch) {
    const c = ch.toLowerCase();
    return (c >= "a" && c <= "z") || (c >= "0" && c <= "9");
  }
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    while (left < right && !ok(s[left])) left++;
    while (left < right && !ok(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
            python: `def is_palindrome(s):
    def ok(ch):
        c = ch.lower()
        return (c >= "a" and c <= "z") or (c >= "0" and c <= "9")
    left = 0
    right = len(s) - 1
    while left < right:
        while left < right and not ok(s[left]): left += 1
        while left < right and not ok(s[right]): right -= 1
        if s[left].lower() != s[right].lower(): return False
        left += 1
        right -= 1
    return True`,
            java: `class Solution {
  public boolean isPalindrome(String s) {
    public void ok(ch) {
      int c = Character.toLowerCase(ch);
      return (c >= "a" && c <= "z") || (c >= "0" && c <= "9");
    }
    int left = 0;
    int right = s.length() - 1;
    while (left < right) {
      while (left < right && !ok(s.charAt(left))) left++;
      while (left < right && !ok(s.charAt(right))) right--;
      if (s.charAt(left).toLowerCase() != s.charAt(right).toLowerCase()) return false;
      left++;
      right--;
    }
    return true;
  }
}`,
            cpp: `// vector, unordered_map, string
bool isPalindrome(string s) {
  auto ok = [&](ch) {
    int c = tolower(ch);
    return (c >= "a" && c <= "z") || (c >= "0" && c <= "9");
  }
  int left = 0;
  int right = (int)s.size() - 1;
  while (left < right) {
    while (left < right && !ok(s[left])) left++;
    while (left < right && !ok(s[right])) right--;
    if (s[left].toLowerCase() != s[right].toLowerCase()) return false;
    left++;
    right--;
  }
  return true;
}`,
            c: `/* pass n for array length; simple loops */
int isPalindrome(char* s) {
  void ok(/* ch */) {
    int c = tolower(ch);
    return (c >= "a" && c <= "z") || (c >= "0" && c <= "9");
  }
  int left = 0;
  int right = strlen(s) - 1;
  while (left < right) {
    while (left < right && !ok(s[left])) left++;
    while (left < right && !ok(s[right])) right--;
    if (s[left].toLowerCase() != s[right].toLowerCase()) return 0;
    left++;
    right--;
  }
  return 1;
}`
          }
        }
      ]
    },
    {
      id: 3,
      level: "intermediate",
      q: "Longest Substring Without Repeating Characters",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "Return the length of the longest substring that contains no repeated character.\n\nExample: \"abcabcbb\" -> 3 (\"abc\"). Example: \"bbbbb\" -> 1.\n\nChecking every substring is cubic if you rescan for uniqueness. Starting at each left and growing with a Set is quadratic. A sliding window plus last-seen index is linear.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n³)",
          space: "O(n)",
          why: "O(n²) substrings, and each uniqueness check can scan the slice again.\nHow it works: for every i..j, a Set of s[i..j] must have size j-i+1. Keep the max length.",
          code: `function lengthOfLongestSubstring(s) {
  const n = s.length;
  let best = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const seen = new Set();
      let unique = true;
      for (let k = i; k <= j; k++) {
        if (seen.has(s[k])) { unique = false; break; }
        seen.add(s[k]);
      }
      if (unique && j - i + 1 > best) best = j - i + 1;
    }
  }
  return best;
}`,
          codes: {
            javascript: `function lengthOfLongestSubstring(s) {
  const n = s.length;
  let best = 0;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      const seen = new Set();
      let unique = true;
      for (let k = i; k <= j; k++) {
        if (seen.has(s[k])) { unique = false; break; }
        seen.add(s[k]);
      }
      if (unique && j - i + 1 > best) best = j - i + 1;
    }
  }
  return best;
}`,
            python: `def length_of_longest_substring(s):
    n = len(s)
    best = 0
    for i in range(n):

        for j in range(i, n):

            seen = set()
            unique = True
            for k in range(i, = j):

                if s[k] in seen: { unique = False break }
                seen.add(s[k])

            if unique and j - i + 1 > best: best = j - i + 1

    return best`,
            java: `class Solution {
  public int lengthOfLongestSubstring(String s) {
    int n = s.length();
    int best = 0;
    for (int i = 0; i < n; i++) {
      for (int j = i; j < n; j++) {
        Set<Integer> seen = new HashSet<>();
        boolean unique = true;
        for (int k = i; k <= j; k++) {
          if (seen.contains(s.charAt(k))) { unique = false; break; }
          seen.add(s.charAt(k));
        }
        if (unique && j - i + 1 > best) best = j - i + 1;
      }
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int lengthOfLongestSubstring(string s) {
  int n = (int)s.size();
  int best = 0;
  for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
      unordered_set<int> seen;
      bool unique = true;
      for (int k = i; k <= j; k++) {
        if (seen.count(s[k])) { unique = false; break; }
        seen.insert(s[k]);
      }
      if (unique && j - i + 1 > best) best = j - i + 1;
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
int lengthOfLongestSubstring(char* s) {
  /* n is the given length */
  int best = 0;
  for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
      int seen_keys[1024]; int seen_n = 0;
      int unique = 1;
      for (int k = i; k <= j; k++) {
        if (map_find(seen_keys, seen_n, s[k]) >= 0) { unique = 0; break; }
        /* add */;
      }
      if (unique && j - i + 1 > best) best = j - i + 1;
    }
  }
  return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(n)",
          why: "From each start, grow right until a repeat. Inner work is O(n), times n starts.\nHow it works: seen is a Set for the current window. On a repeat, break and try the next start.",
          code: `function lengthOfLongestSubstring(s) {
  let best = 0;
  const n = s.length;
  for (let i = 0; i < n; i++) {
    const seen = new Set();
    for (let j = i; j < n; j++) {
      if (seen.has(s[j])) break;
      seen.add(s[j]);
      if (j - i + 1 > best) best = j - i + 1;
    }
  }
  return best;
}`,
          codes: {
            javascript: `function lengthOfLongestSubstring(s) {
  let best = 0;
  const n = s.length;
  for (let i = 0; i < n; i++) {
    const seen = new Set();
    for (let j = i; j < n; j++) {
      if (seen.has(s[j])) break;
      seen.add(s[j]);
      if (j - i + 1 > best) best = j - i + 1;
    }
  }
  return best;
}`,
            python: `def length_of_longest_substring(s):
    best = 0
    n = len(s)
    for i in range(n):

        seen = set()
        for j in range(i, n):

            if s[j] in seen: break
            seen.add(s[j])
            if j - i + 1 > best: best = j - i + 1

    return best`,
            java: `class Solution {
  public int lengthOfLongestSubstring(String s) {
    int best = 0;
    int n = s.length();
    for (int i = 0; i < n; i++) {
      Set<Integer> seen = new HashSet<>();
      for (int j = i; j < n; j++) {
        if (seen.contains(s.charAt(j))) break;
        seen.add(s.charAt(j));
        if (j - i + 1 > best) best = j - i + 1;
      }
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int lengthOfLongestSubstring(string s) {
  int best = 0;
  int n = (int)s.size();
  for (int i = 0; i < n; i++) {
    unordered_set<int> seen;
    for (int j = i; j < n; j++) {
      if (seen.count(s[j])) break;
      seen.insert(s[j]);
      if (j - i + 1 > best) best = j - i + 1;
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
int lengthOfLongestSubstring(char* s) {
  int best = 0;
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    int seen_keys[1024]; int seen_n = 0;
    for (int j = i; j < n; j++) {
      if (map_find(seen_keys, seen_n, s[j]) >= 0) break;
      /* add */;
      if (j - i + 1 > best) best = j - i + 1;
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
          why: "Each index is a right endpoint once. left only moves forward. Map stores last indexes.\nHow it works: if this character last appeared inside the window, jump left past it. Then update last index and best length.",
          code: `function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
    last.set(ch, right);
    const len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}`,
          codes: {
            javascript: `function lengthOfLongestSubstring(s) {
  const last = new Map();
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    if (last.has(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
    last.set(ch, right);
    const len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}`,
            python: `def length_of_longest_substring(s):
    last = {}
    left = 0
    best = 0
    for right in range(len(s)):

        ch = s[right]
        if ch in last and last[ch] >= left) left = last.get(ch: + 1
        last[ch] = right
        length = right - left + 1
        if length > best: best = length

    return best`,
            java: `class Solution {
  public int lengthOfLongestSubstring(String s) {
    Map<Character, Integer> last = new HashMap<>();
    int left = 0;
    int best = 0;
    for (int right = 0; right < s.length(); right++) {
      char ch = s.charAt(right);
      if (last.containsKey(ch) && last.get(ch) >= left) left = last.get(ch) + 1;
      last.put(ch, right);
      int len = right - left + 1;
      if (len > best) best = len;
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int lengthOfLongestSubstring(string s) {
  unordered_map<int,int> last;
  int left = 0;
  int best = 0;
  for (int right = 0; right < (int)s.size(); right++) {
    char ch = s[right];
    if (last.count(ch) && last[ch] >= left) left = last[ch] + 1;
    last[ch] = right;
    int len = right - left + 1;
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
int lengthOfLongestSubstring(char* s) {
  int last_keys[1024]; int last_vals[1024]; int last_n = 0;
  int left = 0;
  int best = 0;
  for (int right = 0; right < strlen(s); right++) {
    int ch = s[right];
    if (map_find(last_keys, last_n, ch) >= 0 && last.get(ch) >= left) left = last.get(ch) + 1;
    /* set last */;
    int len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}`
          }
        }
      ]
    },
    {
      id: 4,
      level: "intermediate",
      q: "Longest Palindromic Substring",
      ask: "Amazon · Microsoft · Google · Adobe",
      a: "Return any longest palindromic substring. A palindrome reads the same forward and backward.\n\nExample: \"babad\" -> \"bab\" or \"aba\". Example: \"cbbd\" -> \"bb\".\n\nAll substrings plus a palindrome check is O(n³). Expand around 2n-1 centers is O(n²). Manacher’s algorithm fills a palindrome radius array in O(n).\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n³)",
          space: "O(1)",
          why: "O(n²) slices, each palindrome test is O(n).\nHow it works: try longer slices first so the first hit is a longest palindrome. isPalin uses two pointers on s[left..right].",
          code: `function longestPalindrome(s) {
  function isPalin(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  const n = s.length;
  for (let len = n; len >= 1; len--) {
    for (let i = 0; i + len - 1 < n; i++) {
      if (isPalin(i, i + len - 1)) return s.slice(i, i + len);
    }
  }
  return "";
}`,
          codes: {
            javascript: `function longestPalindrome(s) {
  function isPalin(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  const n = s.length;
  for (let len = n; len >= 1; len--) {
    for (let i = 0; i + len - 1 < n; i++) {
      if (isPalin(i, i + len - 1)) return s.slice(i, i + len);
    }
  }
  return "";
}`,
            python: `def longest_palindrome(s):
    def is_palin(left, right):
        while left < right:
            if s[left] != s[right]: return False
            left += 1
            right -= 1
        return True
    n = len(s)
    for length in range(n, (1) - 1, -1):

        i = 0
        while i + length - 1 < n:

            if is_palin(i, i + length - 1): return s[i:i + length]

            i += 1

    return ""`,
            java: `class Solution {
  public String longestPalindrome(String s) {
    public void isPalin(left, right) {
      while (left < right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++;
        right--;
      }
      return true;
    }
    int n = s.length();
    for (int len = n; len >= 1; len--) {
      for (int i = 0; i + len - 1 < n; i++) {
        if (isPalin(i, i + len - 1)) return s.substring(i, i + len);
      }
    }
    return "";
  }
}`,
            cpp: `// vector, unordered_map, string
string longestPalindrome(string s) {
  auto isPalin = [&](left, right) {
    while (left < right) {
      if (s[left] != s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  int n = (int)s.size();
  for (int len = n; len >= 1; len--) {
    for (int i = 0; i + len - 1 < n; i++) {
      if (isPalin(i, i + len - 1)) return s.substr(i, (i + len)-(i));
    }
  }
  return "";
}`,
            c: `/* pass n for array length; simple loops */
void longestPalindrome(char* s, char* out) {
  void isPalin(/* left, right */) {
    while (left < right) {
      if (s[left] != s[right]) return 0;
      left++;
      right--;
    }
    return 1;
  }
  /* n is the given length */
  for (int len = n; len >= 1; len--) {
    for (int i = 0; i + len - 1 < n; i++) {
      if (isPalin(i, i + len - 1)) return /* slice s */;
    }
  }
  return "";
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(1)",
          why: "2n-1 expansions, each O(n) in the worst case. Extra memory is a few indexes.\nHow it works: expand(i,i) covers odd length, expand(i,i+1) covers even. Keep the longest slice.",
          code: `function longestPalindrome(s) {
  let bestL = 0;
  let bestR = 0;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      if (right - left > bestR - bestL) {
        bestL = left;
        bestR = right;
      }
      left--;
      right++;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.slice(bestL, bestR + 1);
}`,
          codes: {
            javascript: `function longestPalindrome(s) {
  let bestL = 0;
  let bestR = 0;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      if (right - left > bestR - bestL) {
        bestL = left;
        bestR = right;
      }
      left--;
      right++;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.slice(bestL, bestR + 1);
}`,
            python: `def longest_palindrome(s):
    bestL = 0
    bestR = 0
    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if right - left > bestR - bestL:
                bestL = left
                bestR = right
            left -= 1
            right += 1
    for i in range(len(s)):

        expand(i, i)
        expand(i, i + 1)

    return s[bestL:bestR + 1]`,
            java: `class Solution {
  public String longestPalindrome(String s) {
    int bestL = 0;
    int bestR = 0;
    public void expand(left, right) {
      while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        if (right - left > bestR - bestL) {
          bestL = left;
          bestR = right;
        }
        left--;
        right++;
      }
    }
    for (int i = 0; i < s.length(); i++) {
      expand(i, i);
      expand(i, i + 1);
    }
    return s.substring(bestL, bestR + 1);
  }
}`,
            cpp: `// vector, unordered_map, string
string longestPalindrome(string s) {
  int bestL = 0;
  int bestR = 0;
  auto expand = [&](left, right) {
    while (left >= 0 && right < (int)s.size() && s[left] == s[right]) {
      if (right - left > bestR - bestL) {
        bestL = left;
        bestR = right;
      }
      left--;
      right++;
    }
  }
  for (int i = 0; i < (int)s.size(); i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.substr(bestL, (bestR + 1)-(bestL));
}`,
            c: `/* pass n for array length; simple loops */
void longestPalindrome(char* s, char* out) {
  int bestL = 0;
  int bestR = 0;
  void expand(/* left, right */) {
    while (left >= 0 && right < strlen(s) && s[left] == s[right]) {
      if (right - left > bestR - bestL) {
        bestL = left;
        bestR = right;
      }
      left--;
      right++;
    }
  }
  for (int i = 0; i < strlen(s); i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return /* slice s */;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Manacher: a transformed string with separators, plus a radius array of length 2n+3. Each side is expanded only past the known right bound.\nHow it works: t = ^#s#s#$ so even and odd palindromes look the same. p[i] is the radius. Mirror across center when i is inside right. Original start is (center - radius) / 2 on the # string.",
          code: `function longestPalindrome(s) {
  if (s.length < 2) return s;
  const t = ["^"];
  for (let i = 0; i < s.length; i++) {
    t.push("#");
    t.push(s[i]);
  }
  t.push("#");
  t.push("$");
  const n = t.length;
  const p = new Array(n).fill(0);
  let center = 0;
  let right = 0;
  let bestC = 0;
  let bestLen = 0;
  for (let i = 1; i < n - 1; i++) {
    const mirror = 2 * center - i;
    if (i < right) p[i] = Math.min(right - i, p[mirror]);
    while (t[i + 1 + p[i]] === t[i - 1 - p[i]]) p[i]++;
    if (i + p[i] > right) {
      center = i;
      right = i + p[i];
    }
    if (p[i] > bestLen) {
      bestLen = p[i];
      bestC = i;
    }
  }
  const start = Math.floor((bestC - bestLen) / 2);
  return s.slice(start, start + bestLen);
}`,
          codes: {
            javascript: `function longestPalindrome(s) {
  if (s.length < 2) return s;
  const t = ["^"];
  for (let i = 0; i < s.length; i++) {
    t.push("#");
    t.push(s[i]);
  }
  t.push("#");
  t.push("$");
  const n = t.length;
  const p = new Array(n).fill(0);
  let center = 0;
  let right = 0;
  let bestC = 0;
  let bestLen = 0;
  for (let i = 1; i < n - 1; i++) {
    const mirror = 2 * center - i;
    if (i < right) p[i] = Math.min(right - i, p[mirror]);
    while (t[i + 1 + p[i]] === t[i - 1 - p[i]]) p[i]++;
    if (i + p[i] > right) {
      center = i;
      right = i + p[i];
    }
    if (p[i] > bestLen) {
      bestLen = p[i];
      bestC = i;
    }
  }
  const start = Math.floor((bestC - bestLen) / 2);
  return s.slice(start, start + bestLen);
}`,
            python: `def longest_palindrome(s):
    if len(s) < 2: return s
    t = ["^"]
    for i in range(len(s)):

        t.append("#")
        t.append(s[i])

    t.append("#")
    t.append("$")
    n = len(t)
    p = [0] * n
    center = 0
    right = 0
    bestC = 0
    bestLen = 0
    for i in range(1, n - 1):

        mirror = 2 * center - i
        if i < right: p[i] = min(right - i, p[mirror])
        while t[i + 1 + p[i]] == t[i - 1 - p[i]]: p[i]++
        if i + p[i] > right:
            center = i
            right = i + p[i]
        if p[i] > bestLen:
            bestLen = p[i]
            bestC = i

    start = ((bestC - bestLen) ) # 2
    return s[start:start + bestLen]`,
            java: `class Solution {
  public String longestPalindrome(String s) {
    if (s.length() < 2) return s;
    int t = ["^"];
    for (int i = 0; i < s.length(); i++) {
      t.add("#");
      t.add(s.charAt(i));
    }
    t.add("#");
    t.add("$");
    int n = t.length;
    int[] p = new int[n];
    int center = 0;
    int right = 0;
    int bestC = 0;
    int bestLen = 0;
    for (int i = 1; i < n - 1; i++) {
      int mirror = 2 * center - i;
      if (i < right) p[i] = Math.min(right - i, p[mirror]);
      while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) p[i]++;
      if (i + p[i] > right) {
        center = i;
        right = i + p[i];
      }
      if (p[i] > bestLen) {
        bestLen = p[i];
        bestC = i;
      }
    }
    int start = ((bestC - bestLen) / 2);
    return s.substring(start, start + bestLen);
  }
}`,
            cpp: `// vector, unordered_map, string
string longestPalindrome(string s) {
  if ((int)s.size() < 2) return s;
  int t = ["^"];
  for (int i = 0; i < (int)s.size(); i++) {
    t.push_back("#");
    t.push_back(s[i]);
  }
  t.push_back("#");
  t.push_back("$");
  int n = (int)t.size();
  vector<int> p = vector<int>(n, 0);
  int center = 0;
  int right = 0;
  int bestC = 0;
  int bestLen = 0;
  for (int i = 1; i < n - 1; i++) {
    int mirror = 2 * center - i;
    if (i < right) p[i] = min(right - i, p[mirror]);
    while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) p[i]++;
    if (i + p[i] > right) {
      center = i;
      right = i + p[i];
    }
    if (p[i] > bestLen) {
      bestLen = p[i];
      bestC = i;
    }
  }
  int start = (int)((bestC - bestLen) / 2);
  return s.substr(start, (start + bestLen)-(start));
}`,
            c: `/* pass n for array length; simple loops */
void longestPalindrome(char* s, char* out) {
  if (strlen(s) < 2) return s;
  int t = ["^"];
  for (int i = 0; i < strlen(s); i++) {
    /* push */("#");
    /* push */(s[i]);
  }
  /* push */("#");
  /* push */("$");
  /* n is the given length */
  int p = /* zeros n */;
  int center = 0;
  int right = 0;
  int bestC = 0;
  int bestLen = 0;
  for (int i = 1; i < n - 1; i++) {
    int mirror = 2 * center - i;
    if (i < right) p[i] = (right - i < p[mirror] ? right - i : p[mirror]);
    while (t[i + 1 + p[i]] == t[i - 1 - p[i]]) p[i]++;
    if (i + p[i] > right) {
      center = i;
      right = i + p[i];
    }
    if (p[i] > bestLen) {
      bestLen = p[i];
      bestC = i;
    }
  }
  int start = ((bestC - bestLen) / 2);
  return /* slice s */;
}`
          }
        }
      ]
    },
    {
      id: 5,
      level: "intermediate",
      q: "Group Anagrams",
      ask: "Amazon · Google · Uber · Apple",
      a: "Group words that are anagrams of each other. Order of groups and order inside a group do not matter.\n\nExample: [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"] -> [[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]].\n\nComparing every pair by sorted letters is quadratic. Sorting each word as a map key is n times k log k. A count signature of 26 numbers as the key is n times k.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n² · k log k)",
          space: "O(n·k)",
          why: "Each word may be compared to every group representative. Each compare sorts a word of length k.\nHow it works: for each word, look for a group whose first word sorts equal to this word. If none, start a new group.",
          code: `function groupAnagrams(strs) {
  function keyOf(word) {
    return word.split("").sort().join("");
  }
  const groups = [];
  for (let i = 0; i < strs.length; i++) {
    const k = keyOf(strs[i]);
    let placed = false;
    for (let g = 0; g < groups.length; g++) {
      if (keyOf(groups[g][0]) === k) {
        groups[g].push(strs[i]);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([strs[i]]);
  }
  return groups;
}`,
          codes: {
            javascript: `function groupAnagrams(strs) {
  function keyOf(word) {
    return word.split("").sort().join("");
  }
  const groups = [];
  for (let i = 0; i < strs.length; i++) {
    const k = keyOf(strs[i]);
    let placed = false;
    for (let g = 0; g < groups.length; g++) {
      if (keyOf(groups[g][0]) === k) {
        groups[g].push(strs[i]);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push([strs[i]]);
  }
  return groups;
}`,
            python: `def group_anagrams(strs):
    def key_of(word):
        return "".join(sorted(word))
    groups = []
    for i in range(len(strs)):

        k = key_of(strs[i])
        placed = False
        for g in range(len(groups)):

            if key_of(groups[g][0]) == k:
                groups[g].push(strs[i])
                placed = True
                break

        if not placed: groups.append([strs[i]])

    return groups`,
            java: `class Solution {
  public List<List<String>> groupAnagrams(String[] strs) {
    public void keyOf(word) {
      return word.split("").sort().join("");
    }
    List<Integer> groups = new ArrayList<>();
    for (int i = 0; i < strs.length; i++) {
      int k = keyOf(strs[i]);
      boolean placed = false;
      for (int g = 0; g < groups.size(); g++) {
        if (keyOf(groups[g][0]) == k) {
          groups[g].push(strs[i]);
          placed = true;
          break;
        }
      }
      if (!placed) groups.add([strs[i]]);
    }
    return groups;
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<string>> groupAnagrams(vector<string>& strs) {
  auto keyOf = [&](word) {
    return /* split word */.sort().join("");
  }
  vector<int> groups;
  for (int i = 0; i < (int)strs.size(); i++) {
    int k = keyOf(strs[i]);
    bool placed = false;
    for (int g = 0; g < (int)groups.size(); g++) {
      if (keyOf(groups[g][0]) == k) {
        groups[g].push(strs[i]);
        placed = true;
        break;
      }
    }
    if (!placed) groups.push_back([strs[i]]);
  }
  return groups;
}`,
            c: `/* pass n for array length; simple loops */
int groupAnagrams(char strs[][64], int n) {
  void keyOf(/* word */) {
    return /* split word */.sort().join("");
  }
  int groups[1024]; int groups_n = 0;
  for (int i = 0; i < n; i++) {
    int k = keyOf(strs[i]);
    int placed = 0;
    for (int g = 0; g < groups_len; g++) {
      if (keyOf(groups[g][0]) == k) {
        groups[g].push(strs[i]);
        placed = 1;
        break;
      }
    }
    if (!placed) /* push */([strs[i]]);
  }
  return groups;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n · k log k)",
          space: "O(n·k)",
          why: "One sort per word, then O(1) average map insert.\nHow it works: map sorted-word -> list of originals. Return the map values.",
          code: `function groupAnagrams(strs) {
  const map = new Map();
  for (let i = 0; i < strs.length; i++) {
    const key = strs[i].split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(strs[i]);
  }
  return Array.from(map.values());
}`,
          codes: {
            javascript: `function groupAnagrams(strs) {
  const map = new Map();
  for (let i = 0; i < strs.length; i++) {
    const key = strs[i].split("").sort().join("");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(strs[i]);
  }
  return Array.from(map.values());
}`,
            python: `def group_anagrams(strs):
    map = {}
    for i in range(len(strs)):

        key = strs[i].split("").sort().join("")
        if key not in map: map[key] = []
        map[key].push(strs[i])

    return list(map.values())`,
            java: `class Solution {
  public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (int i = 0; i < strs.length; i++) {
      String key = strs[i].split("").sort().join("");
      if (!map.containsKey(key)) map.put(key, []);
      map.get(key).push(strs[i]);
    }
    return new ArrayList<>(map.values());
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<string>> groupAnagrams(vector<string>& strs) {
  unordered_map<int,int> map;
  for (int i = 0; i < (int)strs.size(); i++) {
    string key = strs[i].split("").sort().join("");
    if (!map.count(key)) map[key] = [];
    map[key].push(strs[i]);
  }
  return /* values */;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int groupAnagrams(char strs[][64], int n) {
  int map_keys[1024]; int map_vals[1024]; int map_n = 0;
  for (int i = 0; i < n; i++) {
    char key[1024]; /* strs[i].split("").sort().join("") */
    if (!map_find(map_keys, map_n, key) >= 0) /* set map */;
    map.get(key).push(strs[i]);
  }
  return /* values */;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n·k)",
          space: "O(n·k)",
          why: "No per-word sort. Count 26 letters and join them into a key.\nHow it works: count[c]++ for each character. key is the 26 numbers joined by commas so 1,11 does not collide with 11,1.",
          code: `function groupAnagrams(strs) {
  const map = new Map();
  for (let i = 0; i < strs.length; i++) {
    const count = new Array(26).fill(0);
    const word = strs[i];
    for (let j = 0; j < word.length; j++) {
      count[word.charCodeAt(j) - 97]++;
    }
    const key = count.join(",");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
  }
  return Array.from(map.values());
}`,
          codes: {
            javascript: `function groupAnagrams(strs) {
  const map = new Map();
  for (let i = 0; i < strs.length; i++) {
    const count = new Array(26).fill(0);
    const word = strs[i];
    for (let j = 0; j < word.length; j++) {
      count[word.charCodeAt(j) - 97]++;
    }
    const key = count.join(",");
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(word);
  }
  return Array.from(map.values());
}`,
            python: `def group_anagrams(strs):
    map = {}
    for i in range(len(strs)):

        count = [0] * 26
        word = strs[i]
        for j in range(len(word)):

            count[ord(word[j]) - 97]++

        key = ",".join(count)
        if key not in map: map[key] = []
        map[key].push(word)

    return list(map.values())`,
            java: `class Solution {
  public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> map = new HashMap<>();
    for (int i = 0; i < strs.length; i++) {
      int[] count = new int[26];
      String word = strs[i];
      for (int j = 0; j < word.length(); j++) {
        count[(int)word.charAt(j) - 97]++;
      }
      int key = String.join(",", count);
      if (!map.containsKey(key)) map.put(key, []);
      map.get(key).push(word);
    }
    return new ArrayList<>(map.values());
  }
}`,
            cpp: `// vector, unordered_map, string
vector<vector<string>> groupAnagrams(vector<string>& strs) {
  unordered_map<int,int> map;
  for (int i = 0; i < (int)strs.size(); i++) {
    vector<int> count = vector<int>(26, 0);
    string word = strs[i];
    for (int j = 0; j < (int)word.size(); j++) {
      count[(int)word[j] - 97]++;
    }
    int key = /* join count */;
    if (!map.count(key)) map[key] = [];
    map[key].push(word);
  }
  return /* values */;
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int groupAnagrams(char strs[][64], int n) {
  int map_keys[1024]; int map_vals[1024]; int map_n = 0;
  for (int i = 0; i < n; i++) {
    int count = /* zeros 26 */;
    char word[1024]; /* strs[i] */
    for (int j = 0; j < strlen(word); j++) {
      count[(int)word[j] - 97]++;
    }
    int key = /* join count */;
    if (!map_find(map_keys, map_n, key) >= 0) /* set map */;
    map.get(key).push(word);
  }
  return /* values */;
}`
          }
        }
      ]
    },
    {
      id: 6,
      level: "beginner",
      q: "Valid Parentheses",
      ask: "Amazon · Google · Meta · Microsoft",
      a: "s contains only ()[]{}. Return true if every closer matches the most recent unmatched opener and the whole string is used up.\n\nExample: \"()[]{}\" is true. \"([)]\" is false. \"{\" is false.\n\nRepeatedly deleting \"()\" \"[]\" \"{}\" works and is slow. A stack of openers is the linear solution. A map from closer to opener is the same algorithm written without a chain of ifs.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Each pass scans the whole string and removes one pair. Up to n/2 passes.\nHow it works: while any \"()\", \"[]\", or \"{}\" remains, split-join it away. Success is an empty string.",
          code: `function isValid(s) {
  let cur = s;
  let changed = true;
  while (changed) {
    const next = cur.split("()").join("").split("[]").join("").split("{}").join("");
    changed = next !== cur;
    cur = next;
  }
  return cur.length === 0;
}`,
          codes: {
            javascript: `function isValid(s) {
  let cur = s;
  let changed = true;
  while (changed) {
    const next = cur.split("()").join("").split("[]").join("").split("{}").join("");
    changed = next !== cur;
    cur = next;
  }
  return cur.length === 0;
}`,
            python: `def is_valid(s):
    cur = s
    changed = True
    while changed:
        next = list(cur) if "()" == "" else cur.split("()").join("").split("[]").join("").split("{}").join("")
        changed = next != cur
        cur = next
    return len(cur) == 0`,
            java: `class Solution {
  public boolean isValid(String s) {
    int cur = s;
    boolean changed = true;
    while (changed) {
      int next = cur.split("()").join("").split("[]").join("").split("{}").join("");
      changed = next != cur;
      cur = next;
    }
    return cur.length == 0;
  }
}`,
            cpp: `// vector, unordered_map, string
bool isValid(string s) {
  int cur = s;
  bool changed = true;
  while (changed) {
    int next = /* split cur */.join("").split("[]").join("").split("{}").join("");
    changed = next != cur;
    cur = next;
  }
  return (int)cur.size() == 0;
}`,
            c: `/* pass n for array length; simple loops */
int isValid(char* s) {
  int cur = s;
  int changed = 1;
  while (changed) {
    int next = /* split cur */.join("").split("[]").join("").split("{}").join("");
    changed = next != cur;
    cur = next;
  }
  return cur_len == 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One pass. Stack holds at most n openers.\nHow it works: push openers. On a closer, pop and check it is the matching opener. Leftover openers fail.",
          code: `function isValid(s) {
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      const top = stack.pop();
      if (ch === ")" && top !== "(") return false;
      if (ch === "]" && top !== "[") return false;
      if (ch === "}" && top !== "{") return false;
    }
  }
  return stack.length === 0;
}`,
          codes: {
            javascript: `function isValid(s) {
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(" || ch === "[" || ch === "{") {
      stack.push(ch);
    } else {
      const top = stack.pop();
      if (ch === ")" && top !== "(") return false;
      if (ch === "]" && top !== "[") return false;
      if (ch === "}" && top !== "{") return false;
    }
  }
  return stack.length === 0;
}`,
            python: `def is_valid(s):
    stack = []
    for i in range(len(s)):

        ch = s[i]
        if ch == "(" or ch == "[" or ch == "{":
            stack.append(ch)
        else:
            top = stack.pop()
            if ch == ")" and top != "(": return False
            if ch == "]" and top != "[": return False
            if ch == "}" and top != "{": return False

    return len(stack) == 0`,
            java: `class Solution {
  public boolean isValid(String s) {
    List<Integer> stack = new ArrayList<>();
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i);
      if (ch == "(" || ch == "[" || ch == "{") {
        stack.add(ch);
      } else {
        int top = stack.remove(stack.size()() - 1);
        if (ch == ")" && top != "(") return false;
        if (ch == "]" && top != "[") return false;
        if (ch == "}" && top != "{") return false;
      }
    }
    return stack.size() == 0;
  }
}`,
            cpp: `// vector, unordered_map, string
bool isValid(string s) {
  vector<int> stack;
  for (int i = 0; i < (int)s.size(); i++) {
    char ch = s[i];
    if (ch == "(" || ch == "[" || ch == "{") {
      stack.push_back(ch);
    } else {
      int top = ({ auto _t=stack.back(); stack.pop_back(); _t; });
      if (ch == ")" && top != "(") return false;
      if (ch == "]" && top != "[") return false;
      if (ch == "}" && top != "{") return false;
    }
  }
  return (int)stack.size() == 0;
}`,
            c: `/* pass n for array length; simple loops */
int isValid(char* s) {
  int stack[1024]; int stack_n = 0;
  for (int i = 0; i < strlen(s); i++) {
    int ch = s[i];
    if (ch == "(" || ch == "[" || ch == "{") {
      /* push */(ch);
    } else {
      int top = /* pop */;
      if (ch == ")" && top != "(") return 0;
      if (ch == "]" && top != "[") return 0;
      if (ch == "}" && top != "{") return 0;
    }
  }
  return stack_len == 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Same O(n) bound. A pair map avoids three mismatch branches, and odd length fails immediately.\nHow it works: if the character is a key in pairs, it is a closer: pop must equal pairs[ch]. Else it is an opener: push.",
          code: `function isValid(s) {
  if (s.length % 2 === 1) return false;
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (pairs[ch]) {
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
          codes: {
            javascript: `function isValid(s) {
  if (s.length % 2 === 1) return false;
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (pairs[ch]) {
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
            python: `def is_valid(s):
    if len(s) % 2 == 1: return False
    pairs = { ")": "(", "]": "[", "}": "{" }
    stack = []
    for i in range(len(s)):

        ch = s[i]
        if pairs[ch]:
            if stack.pop() != pairs[ch]: return False
        else:
            stack.append(ch)

    return len(stack) == 0`,
            java: `class Solution {
  public boolean isValid(String s) {
    if (s.length() % 2 == 1) return false;
    int pairs = { ")": "(", "]": "[", "}": "{" };
    List<Integer> stack = new ArrayList<>();
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i);
      if (pairs[ch]) {
        if (stack.remove(stack.size()() - 1) != pairs[ch]) return false;
      } else {
        stack.add(ch);
      }
    }
    return stack.size() == 0;
  }
}`,
            cpp: `// vector, unordered_map, string
bool isValid(string s) {
  if ((int)s.size() % 2 == 1) return false;
  int pairs = { ")": "(", "]": "[", "}": "{" };
  vector<int> stack;
  for (int i = 0; i < (int)s.size(); i++) {
    char ch = s[i];
    if (pairs[ch]) {
      if (({ auto _t=stack.back(); stack.pop_back(); _t; }) != pairs[ch]) return false;
    } else {
      stack.push_back(ch);
    }
  }
  return (int)stack.size() == 0;
}`,
            c: `/* pass n for array length; simple loops */
int isValid(char* s) {
  if (strlen(s) % 2 == 1) return 0;
  int pairs = { ")": "(", "]": "[", "}": "{" };
  int stack[1024]; int stack_n = 0;
  for (int i = 0; i < strlen(s); i++) {
    int ch = s[i];
    if (pairs[ch]) {
      if (/* pop */ != pairs[ch]) return 0;
    } else {
      /* push */(ch);
    }
  }
  return stack_len == 0;
}`
          }
        }
      ]
    },
    {
      id: 7,
      level: "beginner",
      q: "Longest Common Prefix",
      ask: "Amazon · Google · Microsoft",
      a: "Return the longest prefix shared by every string in strs. If there is none, return \"\".\n\nExample: [\"flower\",\"flow\",\"flight\"] -> \"fl\". Example: [\"dog\",\"racecar\",\"car\"] -> \"\".\n\nShrinking a running prefix against each next word is simple. Sorting then comparing only the first and last words also works. Vertical scan stops at the first column that disagrees.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(S)",
          space: "O(m)",
          why: "S is the total number of characters. Each word is compared to the current prefix from scratch.\nHow it works: prefix starts as strs[0]. For each next word, cut prefix while it is not a prefix of that word.",
          code: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, prefix.length - 1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}`,
          codes: {
            javascript: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  let prefix = strs[0];
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      prefix = prefix.slice(0, prefix.length - 1);
      if (prefix === "") return "";
    }
  }
  return prefix;
}`,
            python: `def longest_common_prefix(strs):
    if not len(strs): return ""
    prefix = strs[0]
    for i in range(1, len(strs)):

        while strs[i].indexOf(prefix) != 0:
            prefix = prefix[0:len(prefix) - 1]
            if prefix == "": return ""

    return prefix`,
            java: `class Solution {
  public String longestCommonPrefix(String[] strs) {
    if (!strs.length) return "";
    String prefix = strs[0];
    for (int i = 1; i < strs.length; i++) {
      while (strs[i].indexOf(prefix) != 0) {
        prefix = prefix.substring(0, prefix.length() - 1);
        if (prefix == "") return "";
      }
    }
    return prefix;
  }
}`,
            cpp: `// vector, unordered_map, string
string longestCommonPrefix(vector<string>& strs) {
  if (!(int)strs.size()) return "";
  string prefix = strs[0];
  for (int i = 1; i < (int)strs.size(); i++) {
    while (strs[i].indexOf(prefix) != 0) {
      prefix = prefix.substr(0, ((int)prefix.size() - 1)-(0));
      if (prefix == "") return "";
    }
  }
  return prefix;
}`,
            c: `/* pass n for array length; simple loops */
void longestCommonPrefix(char strs[][64], int n, char* out) {
  if (!n) return "";
  char prefix[1024]; /* strs[0] */
  for (int i = 1; i < n; i++) {
    while (strs[i].indexOf(prefix) != 0) {
      prefix = /* slice prefix */;
      if (prefix == "") return "";
    }
  }
  return prefix;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n + m)",
          space: "O(m)",
          why: "Sort the n words, then only the first and last can disagree. m is the shorter of those two.\nHow it works: after sort, walk columns of first vs last until they differ. That slice is the prefix of the whole set.",
          code: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  const list = strs.slice().sort();
  const first = list[0];
  const last = list[list.length - 1];
  let i = 0;
  while (i < first.length && i < last.length && first[i] === last[i]) i++;
  return first.slice(0, i);
}`,
          codes: {
            javascript: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  const list = strs.slice().sort();
  const first = list[0];
  const last = list[list.length - 1];
  let i = 0;
  while (i < first.length && i < last.length && first[i] === last[i]) i++;
  return first.slice(0, i);
}`,
            python: `def longest_common_prefix(strs):
    if not len(strs): return ""
    list = strs[:].sort()
    first = list[0]
    last = list[len(list) - 1]
    i = 0
    while i < len(first) and i < len(last) and first[i] == last[i]: i += 1
    return first[0:i]`,
            java: `class Solution {
  public String longestCommonPrefix(String[] strs) {
    if (!strs.length) return "";
    String list = strs.clone().sort();
    char first = list.charAt(0);
    int last = list.charAt(list.length() - 1);
    int i = 0;
    while (i < first.length && i < last.length && first[i] == last[i]) i++;
    return first.substring(0, i);
  }
}`,
            cpp: `// vector, unordered_map, string
string longestCommonPrefix(vector<string>& strs) {
  if (!(int)strs.size()) return "";
  string list = vector<int>(strs).sort();
  char first = list[0];
  int last = list[(int)list.size() - 1];
  int i = 0;
  while (i < (int)first.size() && i < (int)last.size() && first[i] == last[i]) i++;
  return vector<int>(first.begin()+(0), first.begin()+(i));
}`,
            c: `/* pass n for array length; simple loops */
void longestCommonPrefix(char strs[][64], int n, char* out) {
  if (!n) return "";
  char list[1024]; /* strs.sort() */
  int first = list[0];
  int last = list[strlen(list) - 1];
  int i = 0;
  while (i < first_len && i < last_len && first[i] == last[i]) i++;
  return /* slice first */;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(S)",
          space: "O(1)",
          why: "No sort copy. Extra memory is a few indexes. Worst case still reads every character of every word until a mismatch.\nHow it works: for column i of strs[0], every other word must have the same character. Return the slice before the first failure.",
          code: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  const first = strs[0];
  for (let i = 0; i < first.length; i++) {
    const ch = first[i];
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== ch) return first.slice(0, i);
    }
  }
  return first;
}`,
          codes: {
            javascript: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  const first = strs[0];
  for (let i = 0; i < first.length; i++) {
    const ch = first[i];
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== ch) return first.slice(0, i);
    }
  }
  return first;
}`,
            python: `def longest_common_prefix(strs):
    if not len(strs): return ""
    first = strs[0]
    for i in range(len(first)):

        ch = first[i]
        for j in range(1, len(strs)):

            if i >= strs[j].length or strs[j][i] != ch: return first[0:i]

    return first`,
            java: `class Solution {
  public String longestCommonPrefix(String[] strs) {
    if (!strs.length) return "";
    String first = strs[0];
    for (int i = 0; i < first.length(); i++) {
      char ch = first.charAt(i);
      for (int j = 1; j < strs.length; j++) {
        if (i >= strs[j].length || strs[j][i] != ch) return first.substring(0, i);
      }
    }
    return first;
  }
}`,
            cpp: `// vector, unordered_map, string
string longestCommonPrefix(vector<string>& strs) {
  if (!(int)strs.size()) return "";
  string first = strs[0];
  for (int i = 0; i < (int)first.size(); i++) {
    char ch = first[i];
    for (int j = 1; j < (int)strs.size(); j++) {
      if (i >= strs[j].length || strs[j][i] != ch) return first.substr(0, (i)-(0));
    }
  }
  return first;
}`,
            c: `/* pass n for array length; simple loops */
void longestCommonPrefix(char strs[][64], int n, char* out) {
  if (!n) return "";
  char first[1024]; /* strs[0] */
  for (int i = 0; i < strlen(first); i++) {
    int ch = first[i];
    for (int j = 1; j < n; j++) {
      if (i >= strs[j].length || strs[j][i] != ch) return /* slice first */;
    }
  }
  return first;
}`
          }
        }
      ]
    },
    {
      id: 8,
      level: "beginner",
      q: "Reverse Words in a String",
      ask: "Amazon · Microsoft · Apple · Uber",
      a: "Reverse the order of words. Collapse any extra spaces so words are separated by a single space, with no leading or trailing space.\n\nExample: \"  hello   world  \" -> \"world hello\".\n\nsplit on spaces, drop empties, reverse, join. Doing that with a manual scan is the same idea without leaning on filter. Reverse the whole character array, then reverse each word, then trim spaces.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Library split/filter/reverse/join still copies the string.\nHow it works: split on \" \", drop empty pieces (the extra spaces), reverse the word list, join with one space.",
          code: `function reverseWords(s) {
  const words = s.split(" ").filter(function (w) { return w.length > 0; });
  words.reverse();
  return words.join(" ");
}`,
          codes: {
            javascript: `function reverseWords(s) {
  const words = s.split(" ").filter(function (w) { return w.length > 0; });
  words.reverse();
  return words.join(" ");
}`,
            python: `def reverse_words(s):
    words = list(s) if " " == "" else s.split(" ").__FILTERNZ()
    words.reverse()
    return " ".join(words)`,
            java: `class Solution {
  public String reverseWords(String s) {
    int words = s.split(" ").__FILTERNZ();
    words.reverse();
    return String.join(" ", words);
  }
}`,
            cpp: `// vector, unordered_map, string
string reverseWords(string s) {
  int words = /* split s */.__FILTERNZ();
  words.reverse();
  return /* join words */;
}`,
            c: `/* pass n for array length; simple loops */
void reverseWords(char* s, char* out) {
  int words = /* split s */.__FILTERNZ();
  words.reverse();
  return /* join words */;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One scan to collect words, then build the answer from the end. No filter callback, same linear bound.\nHow it works: skip spaces, slice a word, push it. Then concatenate from the last word to the first with single spaces.",
          code: `function reverseWords(s) {
  const words = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && s[i] === " ") i++;
    if (i >= s.length) break;
    let j = i;
    while (j < s.length && s[j] !== " ") j++;
    words.push(s.slice(i, j));
    i = j;
  }
  let out = "";
  for (let k = words.length - 1; k >= 0; k--) {
    if (out.length) out += " ";
    out += words[k];
  }
  return out;
}`,
          codes: {
            javascript: `function reverseWords(s) {
  const words = [];
  let i = 0;
  while (i < s.length) {
    while (i < s.length && s[i] === " ") i++;
    if (i >= s.length) break;
    let j = i;
    while (j < s.length && s[j] !== " ") j++;
    words.push(s.slice(i, j));
    i = j;
  }
  let out = "";
  for (let k = words.length - 1; k >= 0; k--) {
    if (out.length) out += " ";
    out += words[k];
  }
  return out;
}`,
            python: `def reverse_words(s):
    words = []
    i = 0
    while i < len(s):
        while i < len(s) and s[i] == " ": i += 1
        if i >= len(s): break
        j = i
        while j < len(s) and s[j] != " ": j += 1
        words.append(s[i:j])
        i = j
    out = ""
    for k in range(len(words) - 1, (0) - 1, -1):

        if len(out): out += " "
        out += words[k]

    return out`,
            java: `class Solution {
  public String reverseWords(String s) {
    List<Integer> words = new ArrayList<>();
    int i = 0;
    while (i < s.length()) {
      while (i < s.length() && s.charAt(i) == " ") i++;
      if (i >= s.length()) break;
      int j = i;
      while (j < s.length() && s.charAt(j) != " ") j++;
      words.add(s.substring(i, j));
      i = j;
    }
    String out = "";
    for (int k = words.size() - 1; k >= 0; k--) {
      if (out.length()) out += " ";
      out += words[k];
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
string reverseWords(string s) {
  vector<int> words;
  int i = 0;
  while (i < (int)s.size()) {
    while (i < (int)s.size() && s[i] == " ") i++;
    if (i >= (int)s.size()) break;
    int j = i;
    while (j < (int)s.size() && s[j] != " ") j++;
    words.push_back(s.substr(i, (j)-(i)));
    i = j;
  }
  string out = "";
  for (int k = (int)words.size() - 1; k >= 0; k--) {
    if ((int)out.size()) out += " ";
    out += words[k];
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
void reverseWords(char* s, char* out) {
  int words[1024]; int words_n = 0;
  int i = 0;
  while (i < strlen(s)) {
    while (i < strlen(s) && s[i] == " ") i++;
    if (i >= strlen(s)) break;
    int j = i;
    while (j < strlen(s) && s[j] != " ") j++;
    /* push */(/* slice s */);
    i = j;
  }
  char out[1024]; /* "" */
  for (int k = words_len - 1; k >= 0; k--) {
    if (strlen(out)) out += " ";
    out += words[k];
  }
  return out;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Still O(n) memory because JS strings are immutable; we reverse a character array. This is the in-place pattern interviews describe.\nHow it works: trim extra spaces into a compact array, reverse the whole array, reverse each word between spaces.",
          code: `function reverseWords(s) {
  function reverse(arr, left, right) {
    while (left < right) {
      const t = arr[left];
      arr[left] = arr[right];
      arr[right] = t;
      left++;
      right--;
    }
  }
  const chars = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === " " && (chars.length === 0 || chars[chars.length - 1] === " ")) continue;
    chars.push(s[i]);
  }
  while (chars.length && chars[chars.length - 1] === " ") chars.pop();
  reverse(chars, 0, chars.length - 1);
  let start = 0;
  for (let i = 0; i <= chars.length; i++) {
    if (i === chars.length || chars[i] === " ") {
      reverse(chars, start, i - 1);
      start = i + 1;
    }
  }
  return chars.join("");
}`,
          codes: {
            javascript: `function reverseWords(s) {
  function reverse(arr, left, right) {
    while (left < right) {
      const t = arr[left];
      arr[left] = arr[right];
      arr[right] = t;
      left++;
      right--;
    }
  }
  const chars = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] === " " && (chars.length === 0 || chars[chars.length - 1] === " ")) continue;
    chars.push(s[i]);
  }
  while (chars.length && chars[chars.length - 1] === " ") chars.pop();
  reverse(chars, 0, chars.length - 1);
  let start = 0;
  for (let i = 0; i <= chars.length; i++) {
    if (i === chars.length || chars[i] === " ") {
      reverse(chars, start, i - 1);
      start = i + 1;
    }
  }
  return chars.join("");
}`,
            python: `def reverse_words(s):
    def reverse(arr, left, right):
        while left < right:
            t = arr[left]
            arr[left] = arr[right]
            arr[right] = t
            left += 1
            right -= 1
    chars = []
    for i in range(len(s)):

        if s[i] == " " and (len(chars) == 0 or chars[len(chars) - 1] == " "): continue
        chars.append(s[i])

    while len(chars) and chars[len(chars) - 1] == " ": chars.pop()
    reverse(chars, 0, len(chars) - 1)
    start = 0
    for i in range(= len(chars)):

        if i == len(chars) or chars[i] == " ":
            reverse(chars, start, i - 1)
            start = i + 1

    return "".join(chars)`,
            java: `class Solution {
  public String reverseWords(String s) {
    public void reverse(arr, left, right) {
      while (left < right) {
        int t = arr[left];
        arr[left] = arr[right];
        arr[right] = t;
        left++;
        right--;
      }
    }
    List<Integer> chars = new ArrayList<>();
    for (int i = 0; i < s.length(); i++) {
      if (s.charAt(i) == " " && (chars.size() == 0 || chars[chars.size() - 1] == " ")) continue;
      chars.add(s.charAt(i));
    }
    while (chars.size() && chars[chars.size() - 1] == " ") chars.remove(chars.size()() - 1);
    reverse(chars, 0, chars.size() - 1);
    int start = 0;
    for (int i = 0; i <= chars.size(); i++) {
      if (i == chars.size() || chars[i] == " ") {
        reverse(chars, start, i - 1);
        start = i + 1;
      }
    }
    return String.join("", chars);
  }
}`,
            cpp: `// vector, unordered_map, string
string reverseWords(string s) {
  auto reverse = [&](arr, left, right) {
    while (left < right) {
      int t = arr[left];
      arr[left] = arr[right];
      arr[right] = t;
      left++;
      right--;
    }
  }
  vector<int> chars;
  for (int i = 0; i < (int)s.size(); i++) {
    if (s[i] == " " && ((int)chars.size() == 0 || chars[(int)chars.size() - 1] == " ")) continue;
    chars.push_back(s[i]);
  }
  while ((int)chars.size() && chars[(int)chars.size() - 1] == " ") ({ auto _t=chars.back(); chars.pop_back(); _t; });
  reverse(chars, 0, (int)chars.size() - 1);
  int start = 0;
  for (int i = 0; i <= (int)chars.size(); i++) {
    if (i == (int)chars.size() || chars[i] == " ") {
      reverse(chars, start, i - 1);
      start = i + 1;
    }
  }
  return /* join chars */;
}`,
            c: `/* pass n for array length; simple loops */
void reverseWords(char* s, char* out) {
  void reverse(/* arr, left, right */) {
    while (left < right) {
      int t = arr[left];
      arr[left] = arr[right];
      arr[right] = t;
      left++;
      right--;
    }
  }
  int chars[1024]; int chars_n = 0;
  for (int i = 0; i < strlen(s); i++) {
    if (s[i] == " " && (chars_len == 0 || chars[chars_len - 1] == " ")) continue;
    /* push */(s[i]);
  }
  while (chars_len && chars[chars_len - 1] == " ") /* pop */;
  reverse(chars, 0, chars_len - 1);
  int start = 0;
  for (int i = 0; i <= chars_len; i++) {
    if (i == chars_len || chars[i] == " ") {
      reverse(chars, start, i - 1);
      start = i + 1;
    }
  }
  return /* join chars */;
}`
          }
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "String to Integer (atoi)",
      ask: "Amazon · Microsoft · Google · Meta",
      a: "Parse s as a 32-bit signed integer: skip leading spaces, read an optional sign, read digits, clamp to [-2^31, 2^31 - 1]. Junk after the number is ignored. If no digits, return 0.\n\nExample: \"   -42\" -> -42. Example: \"4193 with words\" -> 4193. Example: \"91283472332\" -> 2147483647.\n\nCollecting digits into a string then Number() still needs a clamp. Multiplying a running total by 10 is the usual loop. Checking overflow before you multiply keeps you inside 32-bit limits.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "You still walk the string once, but you build a digit string and use Number, then clamp.\nHow it works: skip spaces, note sign, gather digits into text. Number(text) * sign, then clamp to 32-bit bounds.",
          code: `function myAtoi(s) {
  let i = 0;
  const n = s.length;
  while (i < n && s[i] === " ") i++;
  let sign = 1;
  if (i < n && (s[i] === "+" || s[i] === "-")) {
    if (s[i] === "-") sign = -1;
    i++;
  }
  let digits = "";
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    digits += s[i];
    i++;
  }
  if (digits.length === 0) return 0;
  let num = sign * Number(digits);
  const lo = -2147483648;
  const hi = 2147483647;
  if (num < lo) return lo;
  if (num > hi) return hi;
  return num;
}`,
          codes: {
            javascript: `function myAtoi(s) {
  let i = 0;
  const n = s.length;
  while (i < n && s[i] === " ") i++;
  let sign = 1;
  if (i < n && (s[i] === "+" || s[i] === "-")) {
    if (s[i] === "-") sign = -1;
    i++;
  }
  let digits = "";
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    digits += s[i];
    i++;
  }
  if (digits.length === 0) return 0;
  let num = sign * Number(digits);
  const lo = -2147483648;
  const hi = 2147483647;
  if (num < lo) return lo;
  if (num > hi) return hi;
  return num;
}`,
            python: `def my_atoi(s):
    i = 0
    n = len(s)
    while i < n and s[i] == " ": i += 1
    sign = 1
    if i < n and (s[i] == "+" or s[i] == "-"):
        if s[i] == "-": sign = -1
        i += 1
    digits = ""
    while i < n and s[i] >= "0" and s[i] <= "9":
        digits += s[i]
        i += 1
    if len(digits) == 0: return 0
    num = sign * int(digits)
    lo = -2147483648
    hi = 2147483647
    if num < lo: return lo
    if num > hi: return hi
    return num`,
            java: `class Solution {
  public int myAtoi(String s) {
    int i = 0;
    int n = s.length();
    while (i < n && s.charAt(i) == " ") i++;
    int sign = 1;
    if (i < n && (s.charAt(i) == "+" || s.charAt(i) == "-")) {
      if (s.charAt(i) == "-") sign = -1;
      i++;
    }
    String digits = "";
    while (i < n && s.charAt(i) >= "0" && s.charAt(i) <= "9") {
      digits += s.charAt(i);
      i++;
    }
    if (digits.length() == 0) return 0;
    int num = sign * Integer.parseInt(digits);
    int lo = -2147483648;
    int hi = 2147483647;
    if (num < lo) return lo;
    if (num > hi) return hi;
    return num;
  }
}`,
            cpp: `// vector, unordered_map, string
int myAtoi(string s) {
  int i = 0;
  int n = (int)s.size();
  while (i < n && s[i] == " ") i++;
  int sign = 1;
  if (i < n && (s[i] == "+" || s[i] == "-")) {
    if (s[i] == "-") sign = -1;
    i++;
  }
  string digits = "";
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    digits += s[i];
    i++;
  }
  if ((int)digits.size() == 0) return 0;
  int num = sign * stoi(digits);
  int lo = -2147483648;
  int hi = 2147483647;
  if (num < lo) return lo;
  if (num > hi) return hi;
  return num;
}`,
            c: `/* pass n for array length; simple loops */
int myAtoi(char* s) {
  int i = 0;
  /* n is the given length */
  while (i < n && s[i] == " ") i++;
  int sign = 1;
  if (i < n && (s[i] == "+" || s[i] == "-")) {
    if (s[i] == "-") sign = -1;
    i++;
  }
  char digits[1024]; /* "" */
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    digits += s[i];
    i++;
  }
  if (strlen(digits) == 0) return 0;
  int num = sign * atoi(digits);
  int lo = -2147483648;
  int hi = 2147483647;
  if (num < lo) return lo;
  if (num > hi) return hi;
  return num;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(1)",
          why: "No digit string. A running number. Clamp after the loop (JS Number can hold these intermediates).\nHow it works: same skip/sign walk. num = num * 10 + digit. Then clamp.",
          code: `function myAtoi(s) {
  let i = 0;
  const n = s.length;
  while (i < n && s[i] === " ") i++;
  let sign = 1;
  if (i < n && (s[i] === "+" || s[i] === "-")) {
    if (s[i] === "-") sign = -1;
    i++;
  }
  let num = 0;
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    num = num * 10 + (s.charCodeAt(i) - 48);
    i++;
  }
  num *= sign;
  const lo = -2147483648;
  const hi = 2147483647;
  if (num < lo) return lo;
  if (num > hi) return hi;
  return num;
}`,
          codes: {
            javascript: `function myAtoi(s) {
  let i = 0;
  const n = s.length;
  while (i < n && s[i] === " ") i++;
  let sign = 1;
  if (i < n && (s[i] === "+" || s[i] === "-")) {
    if (s[i] === "-") sign = -1;
    i++;
  }
  let num = 0;
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    num = num * 10 + (s.charCodeAt(i) - 48);
    i++;
  }
  num *= sign;
  const lo = -2147483648;
  const hi = 2147483647;
  if (num < lo) return lo;
  if (num > hi) return hi;
  return num;
}`,
            python: `def my_atoi(s):
    i = 0
    n = len(s)
    while i < n and s[i] == " ": i += 1
    sign = 1
    if i < n and (s[i] == "+" or s[i] == "-"):
        if s[i] == "-": sign = -1
        i += 1
    num = 0
    while i < n and s[i] >= "0" and s[i] <= "9":
        num = num * 10 + (ord(s[i]) - 48)
        i += 1
    num *= sign
    lo = -2147483648
    hi = 2147483647
    if num < lo: return lo
    if num > hi: return hi
    return num`,
            java: `class Solution {
  public int myAtoi(String s) {
    int i = 0;
    int n = s.length();
    while (i < n && s.charAt(i) == " ") i++;
    int sign = 1;
    if (i < n && (s.charAt(i) == "+" || s.charAt(i) == "-")) {
      if (s.charAt(i) == "-") sign = -1;
      i++;
    }
    int num = 0;
    while (i < n && s.charAt(i) >= "0" && s.charAt(i) <= "9") {
      num = num * 10 + ((int)s.charAt(i) - 48);
      i++;
    }
    num *= sign;
    int lo = -2147483648;
    int hi = 2147483647;
    if (num < lo) return lo;
    if (num > hi) return hi;
    return num;
  }
}`,
            cpp: `// vector, unordered_map, string
int myAtoi(string s) {
  int i = 0;
  int n = (int)s.size();
  while (i < n && s[i] == " ") i++;
  int sign = 1;
  if (i < n && (s[i] == "+" || s[i] == "-")) {
    if (s[i] == "-") sign = -1;
    i++;
  }
  int num = 0;
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    num = num * 10 + ((int)s[i] - 48);
    i++;
  }
  num *= sign;
  int lo = -2147483648;
  int hi = 2147483647;
  if (num < lo) return lo;
  if (num > hi) return hi;
  return num;
}`,
            c: `/* pass n for array length; simple loops */
int myAtoi(char* s) {
  int i = 0;
  /* n is the given length */
  while (i < n && s[i] == " ") i++;
  int sign = 1;
  if (i < n && (s[i] == "+" || s[i] == "-")) {
    if (s[i] == "-") sign = -1;
    i++;
  }
  int num = 0;
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    num = num * 10 + ((int)s[i] - 48);
    i++;
  }
  num *= sign;
  int lo = -2147483648;
  int hi = 2147483647;
  if (num < lo) return lo;
  if (num > hi) return hi;
  return num;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Overflow is stopped as soon as the next digit would leave 32-bit range, matching a language without big numbers.\nHow it works: before num = num*10 + d, if num > 214748364 or (num === 214748364 and d > 7), return the clamped bound for this sign.",
          code: `function myAtoi(s) {
  let i = 0;
  const n = s.length;
  const lo = -2147483648;
  const hi = 2147483647;
  while (i < n && s[i] === " ") i++;
  let sign = 1;
  if (i < n && (s[i] === "+" || s[i] === "-")) {
    if (s[i] === "-") sign = -1;
    i++;
  }
  let num = 0;
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    const d = s.charCodeAt(i) - 48;
    if (num > 214748364 || (num === 214748364 && d > 7)) {
      return sign === 1 ? hi : lo;
    }
    num = num * 10 + d;
    i++;
  }
  return num * sign;
}`,
          codes: {
            javascript: `function myAtoi(s) {
  let i = 0;
  const n = s.length;
  const lo = -2147483648;
  const hi = 2147483647;
  while (i < n && s[i] === " ") i++;
  let sign = 1;
  if (i < n && (s[i] === "+" || s[i] === "-")) {
    if (s[i] === "-") sign = -1;
    i++;
  }
  let num = 0;
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    const d = s.charCodeAt(i) - 48;
    if (num > 214748364 || (num === 214748364 && d > 7)) {
      return sign === 1 ? hi : lo;
    }
    num = num * 10 + d;
    i++;
  }
  return num * sign;
}`,
            python: `def my_atoi(s):
    i = 0
    n = len(s)
    lo = -2147483648
    hi = 2147483647
    while i < n and s[i] == " ": i += 1
    sign = 1
    if i < n and (s[i] == "+" or s[i] == "-"):
        if s[i] == "-": sign = -1
        i += 1
    num = 0
    while i < n and s[i] >= "0" and s[i] <= "9":
        d = ord(s[i]) - 48
        if num > 214748364 or (num == 214748364 and d > 7):
            hi if return sign == 1 else lo
        num = num * 10 + d
        i += 1
    return num * sign`,
            java: `class Solution {
  public int myAtoi(String s) {
    int i = 0;
    int n = s.length();
    int lo = -2147483648;
    int hi = 2147483647;
    while (i < n && s.charAt(i) == " ") i++;
    int sign = 1;
    if (i < n && (s.charAt(i) == "+" || s.charAt(i) == "-")) {
      if (s.charAt(i) == "-") sign = -1;
      i++;
    }
    int num = 0;
    while (i < n && s.charAt(i) >= "0" && s.charAt(i) <= "9") {
      int d = (int)s.charAt(i) - 48;
      if (num > 214748364 || (num == 214748364 && d > 7)) {
        return sign == 1 ? hi : lo;
      }
      num = num * 10 + d;
      i++;
    }
    return num * sign;
  }
}`,
            cpp: `// vector, unordered_map, string
int myAtoi(string s) {
  int i = 0;
  int n = (int)s.size();
  int lo = -2147483648;
  int hi = 2147483647;
  while (i < n && s[i] == " ") i++;
  int sign = 1;
  if (i < n && (s[i] == "+" || s[i] == "-")) {
    if (s[i] == "-") sign = -1;
    i++;
  }
  int num = 0;
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    int d = (int)s[i] - 48;
    if (num > 214748364 || (num == 214748364 && d > 7)) {
      return sign == 1 ? hi : lo;
    }
    num = num * 10 + d;
    i++;
  }
  return num * sign;
}`,
            c: `/* pass n for array length; simple loops */
int myAtoi(char* s) {
  int i = 0;
  /* n is the given length */
  int lo = -2147483648;
  int hi = 2147483647;
  while (i < n && s[i] == " ") i++;
  int sign = 1;
  if (i < n && (s[i] == "+" || s[i] == "-")) {
    if (s[i] == "-") sign = -1;
    i++;
  }
  int num = 0;
  while (i < n && s[i] >= "0" && s[i] <= "9") {
    int d = (int)s[i] - 48;
    if (num > 214748364 || (num == 214748364 && d > 7)) {
      return sign == 1 ? hi : lo;
    }
    num = num * 10 + d;
    i++;
  }
  return num * sign;
}`
          }
        }
      ]
    },
    {
      id: 10,
      level: "beginner",
      q: "Find the Index of the First Occurrence in a String",
      ask: "Amazon · Google · Microsoft · Apple",
      a: "Return the first index where needle appears in haystack, or -1 if it never appears. This is strStr / indexOf.\n\nExample: haystack = \"sadbutsad\", needle = \"sad\" -> 0. Example: \"leetcode\", \"leeto\" -> -1.\n\nTrying needle at every start is O((n-m)*m). The same nested loops with an early break is the usual brute you then optimize. KMP builds a prefix table and searches in O(n+m).\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O((n-m)·m)",
          space: "O(1)",
          why: "Every start position compares up to m characters.\nHow it works: for each i, check whether haystack[i..i+m) equals needle. First hit wins.",
          code: `function strStr(haystack, needle) {
  const n = haystack.length;
  const m = needle.length;
  if (m === 0) return 0;
  for (let i = 0; i + m <= n; i++) {
    let ok = true;
    for (let j = 0; j < m; j++) {
      if (haystack[i + j] !== needle[j]) { ok = false; break; }
    }
    if (ok) return i;
  }
  return -1;
}`,
          codes: {
            javascript: `function strStr(haystack, needle) {
  const n = haystack.length;
  const m = needle.length;
  if (m === 0) return 0;
  for (let i = 0; i + m <= n; i++) {
    let ok = true;
    for (let j = 0; j < m; j++) {
      if (haystack[i + j] !== needle[j]) { ok = false; break; }
    }
    if (ok) return i;
  }
  return -1;
}`,
            python: `def str_str(haystack, needle):
    n = len(haystack)
    m = len(needle)
    if m == 0: return 0
    i = 0
    while i + m <= n:

        ok = True
        for j in range(m):

            if haystack[i + j] != needle[j]: { ok = False break }

        if ok: return i

        i += 1
    return -1`,
            java: `class Solution {
  public int strStr(String haystack, String needle) {
    int n = haystack.length();
    int m = needle.length();
    if (m == 0) return 0;
    for (int i = 0; i + m <= n; i++) {
      boolean ok = true;
      for (int j = 0; j < m; j++) {
        if (haystack.charAt(i + j) != needle.charAt(j)) { ok = false; break; }
      }
      if (ok) return i;
    }
    return -1;
  }
}`,
            cpp: `// vector, unordered_map, string
int strStr(string haystack, string needle) {
  int n = (int)haystack.size();
  int m = (int)needle.size();
  if (m == 0) return 0;
  for (int i = 0; i + m <= n; i++) {
    bool ok = true;
    for (int j = 0; j < m; j++) {
      if (haystack[i + j] != needle[j]) { ok = false; break; }
    }
    if (ok) return i;
  }
  return -1;
}`,
            c: `/* pass n for array length; simple loops */
int strStr(char* haystack, char* needle) {
  /* n is the given length */
  int m = strlen(needle);
  if (m == 0) return 0;
  for (int i = 0; i + m <= n; i++) {
    int ok = 1;
    for (int j = 0; j < m; j++) {
      if (haystack[i + j] != needle[j]) { ok = 0; break; }
    }
    if (ok) return i;
  }
  return -1;
}`
          }
        },
        {
          name: "Optimal",
          time: "O((n-m)·m)",
          space: "O(1)",
          why: "Same worst-case bound, fewer inner steps when the first character already mismatches (slice avoided).\nHow it works: skip starts whose first character is wrong, then compare the rest. Empty needle returns 0.",
          code: `function strStr(haystack, needle) {
  const n = haystack.length;
  const m = needle.length;
  if (m === 0) return 0;
  for (let i = 0; i + m <= n; i++) {
    if (haystack[i] !== needle[0]) continue;
    let j = 1;
    while (j < m && haystack[i + j] === needle[j]) j++;
    if (j === m) return i;
  }
  return -1;
}`,
          codes: {
            javascript: `function strStr(haystack, needle) {
  const n = haystack.length;
  const m = needle.length;
  if (m === 0) return 0;
  for (let i = 0; i + m <= n; i++) {
    if (haystack[i] !== needle[0]) continue;
    let j = 1;
    while (j < m && haystack[i + j] === needle[j]) j++;
    if (j === m) return i;
  }
  return -1;
}`,
            python: `def str_str(haystack, needle):
    n = len(haystack)
    m = len(needle)
    if m == 0: return 0
    i = 0
    while i + m <= n:

        if haystack[i] != needle[0]: continue
        j = 1
        while j < m and haystack[i + j] == needle[j]: j += 1
        if j == m: return i

        i += 1
    return -1`,
            java: `class Solution {
  public int strStr(String haystack, String needle) {
    int n = haystack.length();
    int m = needle.length();
    if (m == 0) return 0;
    for (int i = 0; i + m <= n; i++) {
      if (haystack.charAt(i) != needle.charAt(0)) continue;
      int j = 1;
      while (j < m && haystack.charAt(i + j) == needle.charAt(j)) j++;
      if (j == m) return i;
    }
    return -1;
  }
}`,
            cpp: `// vector, unordered_map, string
int strStr(string haystack, string needle) {
  int n = (int)haystack.size();
  int m = (int)needle.size();
  if (m == 0) return 0;
  for (int i = 0; i + m <= n; i++) {
    if (haystack[i] != needle[0]) continue;
    int j = 1;
    while (j < m && haystack[i + j] == needle[j]) j++;
    if (j == m) return i;
  }
  return -1;
}`,
            c: `/* pass n for array length; simple loops */
int strStr(char* haystack, char* needle) {
  /* n is the given length */
  int m = strlen(needle);
  if (m == 0) return 0;
  for (int i = 0; i + m <= n; i++) {
    if (haystack[i] != needle[0]) continue;
    int j = 1;
    while (j < m && haystack[i + j] == needle[j]) j++;
    if (j == m) return i;
  }
  return -1;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n + m)",
          space: "O(m)",
          why: "KMP: build lps of the needle in O(m), then scan haystack in O(n) without restarting from scratch on mismatch.\nHow it works: lps[i] is the longest proper prefix of needle[0..i] that is also a suffix. On mismatch, j = lps[j-1] instead of j = 0 always.",
          code: `function strStr(haystack, needle) {
  const n = haystack.length;
  const m = needle.length;
  if (m === 0) return 0;
  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;
  while (i < m) {
    if (needle[i] === needle[len]) {
      len++;
      lps[i] = len;
      i++;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i++;
    }
  }
  let hi = 0;
  let ni = 0;
  while (hi < n) {
    if (haystack[hi] === needle[ni]) {
      hi++;
      ni++;
      if (ni === m) return hi - m;
    } else if (ni > 0) {
      ni = lps[ni - 1];
    } else {
      hi++;
    }
  }
  return -1;
}`,
          codes: {
            javascript: `function strStr(haystack, needle) {
  const n = haystack.length;
  const m = needle.length;
  if (m === 0) return 0;
  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;
  while (i < m) {
    if (needle[i] === needle[len]) {
      len++;
      lps[i] = len;
      i++;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i++;
    }
  }
  let hi = 0;
  let ni = 0;
  while (hi < n) {
    if (haystack[hi] === needle[ni]) {
      hi++;
      ni++;
      if (ni === m) return hi - m;
    } else if (ni > 0) {
      ni = lps[ni - 1];
    } else {
      hi++;
    }
  }
  return -1;
}`,
            python: `def str_str(haystack, needle):
    n = len(haystack)
    m = len(needle)
    if m == 0: return 0
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if needle[i] == needle[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length > 0:
            length = lps[length - 1]
        else:
            lps[i] = 0
            i += 1
    hi = 0
    ni = 0
    while hi < n:
        if haystack[hi] == needle[ni]:
            hi += 1
            ni += 1
            if ni == m: return hi - m
        elif ni > 0:
            ni = lps[ni - 1]
        else:
            hi += 1
    return -1`,
            java: `class Solution {
  public int strStr(String haystack, String needle) {
    int n = haystack.length();
    int m = needle.length();
    if (m == 0) return 0;
    int[] lps = new int[m];
    int len = 0;
    int i = 1;
    while (i < m) {
      if (needle.charAt(i) == needle.charAt(len)) {
        len++;
        lps[i] = len;
        i++;
      } else if (len > 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
    int hi = 0;
    int ni = 0;
    while (hi < n) {
      if (haystack.charAt(hi) == needle.charAt(ni)) {
        hi++;
        ni++;
        if (ni == m) return hi - m;
      } else if (ni > 0) {
        ni = lps[ni - 1];
      } else {
        hi++;
      }
    }
    return -1;
  }
}`,
            cpp: `// vector, unordered_map, string
int strStr(string haystack, string needle) {
  int n = (int)haystack.size();
  int m = (int)needle.size();
  if (m == 0) return 0;
  vector<int> lps = vector<int>(m, 0);
  int len = 0;
  int i = 1;
  while (i < m) {
    if (needle[i] == needle[len]) {
      len++;
      lps[i] = len;
      i++;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i++;
    }
  }
  int hi = 0;
  int ni = 0;
  while (hi < n) {
    if (haystack[hi] == needle[ni]) {
      hi++;
      ni++;
      if (ni == m) return hi - m;
    } else if (ni > 0) {
      ni = lps[ni - 1];
    } else {
      hi++;
    }
  }
  return -1;
}`,
            c: `/* pass n for array length; simple loops */
int strStr(char* haystack, char* needle) {
  /* n is the given length */
  int m = strlen(needle);
  if (m == 0) return 0;
  int lps = /* zeros m */;
  int len = 0;
  int i = 1;
  while (i < m) {
    if (needle[i] == needle[len]) {
      len++;
      lps[i] = len;
      i++;
    } else if (len > 0) {
      len = lps[len - 1];
    } else {
      lps[i] = 0;
      i++;
    }
  }
  int hi = 0;
  int ni = 0;
  while (hi < n) {
    if (haystack[hi] == needle[ni]) {
      hi++;
      ni++;
      if (ni == m) return hi - m;
    } else if (ni > 0) {
      ni = lps[ni - 1];
    } else {
      hi++;
    }
  }
  return -1;
}`
          }
        }
      ]
    },
    {
      id: 11,
      level: "advanced",
      q: "Minimum Window Substring",
      ask: "Meta · Amazon · Google · Uber",
      a: "Return the shortest substring of s that covers every character in t (including duplicates). If none exists, return \"\".\n\nExample: s = \"ADOBECODEBANC\", t = \"ABC\" -> \"BANC\".\n\nChecking every window for coverage is cubic/quadratic. Expanding from each left with a need map is still quadratic. Two pointers with a formed counter find every valid window as right grows and left shrinks, in linear time.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n² · k)",
          space: "O(k)",
          why: "Every i..j window rebuilds counts against t. k is the alphabet / unique letters in t.\nHow it works: covers() copies t’s need map and decrements for each character of the slice. Keep the shortest slice that covers.",
          code: `function minWindow(s, t) {
  function covers(slice) {
    const need = new Map();
    for (let i = 0; i < t.length; i++) {
      need.set(t[i], (need.get(t[i]) || 0) + 1);
    }
    for (let i = 0; i < slice.length; i++) {
      const ch = slice[i];
      if (need.has(ch)) {
        need.set(ch, need.get(ch) - 1);
        if (need.get(ch) === 0) need.delete(ch);
      }
    }
    return need.size === 0;
  }
  let best = "";
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const slice = s.slice(i, j + 1);
      if (covers(slice) && (best === "" || slice.length < best.length)) best = slice;
    }
  }
  return best;
}`,
          codes: {
            javascript: `function minWindow(s, t) {
  function covers(slice) {
    const need = new Map();
    for (let i = 0; i < t.length; i++) {
      need.set(t[i], (need.get(t[i]) || 0) + 1);
    }
    for (let i = 0; i < slice.length; i++) {
      const ch = slice[i];
      if (need.has(ch)) {
        need.set(ch, need.get(ch) - 1);
        if (need.get(ch) === 0) need.delete(ch);
      }
    }
    return need.size === 0;
  }
  let best = "";
  for (let i = 0; i < s.length; i++) {
    for (let j = i; j < s.length; j++) {
      const slice = s.slice(i, j + 1);
      if (covers(slice) && (best === "" || slice.length < best.length)) best = slice;
    }
  }
  return best;
}`,
            python: `def min_window(s, t):
    def covers(slice):
        need = {}
        for i in range(len(t)):

            need[t[i]] = need.get(t[i], 0 + 1)

        for i in range(len(slice)):

            ch = slice[i]
            if ch in need:
                need[ch] = need.get(ch - 1)
                if need[ch] == 0: need.pop(ch, None)

        return len(need) == 0
    best = ""
    for i in range(len(s)):

        for j in range(i, len(s)):

            slice = s[i:j + 1]
            if covers(slice) and (best == "" or len(slice) < len(best)): best = slice

    return best`,
            java: `class Solution {
  public String minWindow(String s, String t) {
    public void covers(slice) {
      Map<Character, Integer> need = new HashMap<>();
      for (int i = 0; i < t.length(); i++) {
        need.put(t.charAt(i), (need.getOrDefault(t.charAt(i), 0)) + 1);
      }
      for (int i = 0; i < slice.length(); i++) {
        char ch = slice.charAt(i);
        if (need.containsKey(ch)) {
          need.put(ch, need.get(ch) - 1);
          if (need.get(ch) == 0) need.remove(ch);
        }
      }
      return need.size() == 0;
    }
    String best = "";
    for (int i = 0; i < s.length(); i++) {
      for (int j = i; j < s.length(); j++) {
        String slice = s.substring(i, j + 1);
        if (covers(slice) && (best == "" || slice.length() < best.length())) best = slice;
      }
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
string minWindow(string s, string t) {
  auto covers = [&](slice) {
    unordered_map<int,int> need;
    for (int i = 0; i < (int)t.size(); i++) {
      need[t[i]] = (need.count(t[i] ? need[t[i]] : 0) + 1);
    }
    for (int i = 0; i < (int)slice.size(); i++) {
      char ch = slice[i];
      if (need.count(ch)) {
        need[ch] = need[ch] - 1;
        if (need[ch] == 0) need.erase(ch);
      }
    }
    return need.size() == 0;
  }
  string best = "";
  for (int i = 0; i < (int)s.size(); i++) {
    for (int j = i; j < (int)s.size(); j++) {
      string slice = s.substr(i, (j + 1)-(i));
      if (covers(slice) && (best == "" || (int)slice.size() < (int)best.size())) best = slice;
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
void minWindow(char* s, char* t, char* out) {
  void covers(/* slice */) {
    int need_keys[1024]; int need_vals[1024]; int need_n = 0;
    for (int i = 0; i < strlen(t); i++) {
      /* set need */ + 1);
    }
    for (int i = 0; i < strlen(slice); i++) {
      int ch = slice[i];
      if (map_find(need_keys, need_n, ch) >= 0) {
        /* set need */ - 1);
        if (need.get(ch) == 0) /* del */;
      }
    }
    return need_n == 0;
  }
  char best[1024]; /* "" */
  for (int i = 0; i < strlen(s); i++) {
    for (int j = i; j < strlen(s); j++) {
      char slice[1024]; /* /* slice s */ */
      if (covers(slice) && (best == "" || strlen(slice) < strlen(best))) best = slice;
    }
  }
  return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(k)",
          why: "From each left, grow right until t is covered, then record and try the next left. Still quadratic starts.\nHow it works: missing starts as t.length. A need map counts t. As right adds characters, missing drops. First time missing hits 0, that window is a candidate.",
          code: `function minWindow(s, t) {
  if (t.length > s.length) return "";
  let best = "";
  for (let left = 0; left < s.length; left++) {
    const need = new Map();
    for (let i = 0; i < t.length; i++) need.set(t[i], (need.get(t[i]) || 0) + 1);
    let missing = t.length;
    for (let right = left; right < s.length; right++) {
      const ch = s[right];
      if (need.has(ch) && need.get(ch) > 0) missing--;
      if (need.has(ch)) need.set(ch, need.get(ch) - 1);
      if (missing === 0) {
        const slice = s.slice(left, right + 1);
        if (best === "" || slice.length < best.length) best = slice;
        break;
      }
    }
  }
  return best;
}`,
          codes: {
            javascript: `function minWindow(s, t) {
  if (t.length > s.length) return "";
  let best = "";
  for (let left = 0; left < s.length; left++) {
    const need = new Map();
    for (let i = 0; i < t.length; i++) need.set(t[i], (need.get(t[i]) || 0) + 1);
    let missing = t.length;
    for (let right = left; right < s.length; right++) {
      const ch = s[right];
      if (need.has(ch) && need.get(ch) > 0) missing--;
      if (need.has(ch)) need.set(ch, need.get(ch) - 1);
      if (missing === 0) {
        const slice = s.slice(left, right + 1);
        if (best === "" || slice.length < best.length) best = slice;
        break;
      }
    }
  }
  return best;
}`,
            python: `def min_window(s, t):
    if len(t) > len(s): return ""
    best = ""
    for left in range(len(s)):

        need = {}
        for i in range(len(t)):
            need[t[i]] = need.get(t[i], 0 + 1)
        missing = len(t)
        for right in range(left, len(s)):

            ch = s[right]
            if ch in need and need[ch] > 0: missing -= 1
            if ch in need) need[ch] = need.get(ch: - 1
            if missing == 0:
                slice = s[left:right + 1]
                if best == "" or len(slice) < len(best): best = slice
                break

    return best`,
            java: `class Solution {
  public String minWindow(String s, String t) {
    if (t.length() > s.length()) return "";
    String best = "";
    for (int left = 0; left < s.length(); left++) {
      Map<Character, Integer> need = new HashMap<>();
      for (int i = 0; i < t.length(); i++) need.put(t.charAt(i), (need.getOrDefault(t.charAt(i), 0)) + 1);
      int missing = t.length();
      for (int right = left; right < s.length(); right++) {
        char ch = s.charAt(right);
        if (need.containsKey(ch) && need.get(ch) > 0) missing--;
        if (need.containsKey(ch)) need.put(ch, need.get(ch) - 1);
        if (missing == 0) {
          String slice = s.substring(left, right + 1);
          if (best == "" || slice.length() < best.length()) best = slice;
          break;
        }
      }
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
string minWindow(string s, string t) {
  if ((int)t.size() > (int)s.size()) return "";
  string best = "";
  for (int left = 0; left < (int)s.size(); left++) {
    unordered_map<int,int> need;
    for (int i = 0; i < (int)t.size(); i++) need[t[i]] = (need.count(t[i] ? need[t[i]] : 0) + 1);
    int missing = (int)t.size();
    for (int right = left; right < (int)s.size(); right++) {
      char ch = s[right];
      if (need.count(ch) && need[ch] > 0) missing--;
      if (need.count(ch)) need[ch] = need[ch] - 1;
      if (missing == 0) {
        string slice = s.substr(left, (right + 1)-(left));
        if (best == "" || (int)slice.size() < (int)best.size()) best = slice;
        break;
      }
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
void minWindow(char* s, char* t, char* out) {
  if (strlen(t) > strlen(s)) return "";
  char best[1024]; /* "" */
  for (int left = 0; left < strlen(s); left++) {
    int need_keys[1024]; int need_vals[1024]; int need_n = 0;
    for (int i = 0; i < strlen(t); i++) /* set need */ + 1);
    int missing = strlen(t);
    for (int right = left; right < strlen(s); right++) {
      int ch = s[right];
      if (map_find(need_keys, need_n, ch) >= 0 && need.get(ch) > 0) missing--;
      if (map_find(need_keys, need_n, ch) >= 0) /* set need */ - 1);
      if (missing == 0) {
        char slice[1024]; /* /* slice s */ */
        if (best == "" || strlen(slice) < strlen(best)) best = slice;
        break;
      }
    }
  }
  return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(k)",
          why: "right walks n times, left walks n times. formed tracks how many unique t-characters are satisfied.\nHow it works: grow right, update have. While the window is complete, record if smaller, drop s[left], move left. needCount is the number of unique keys in t.",
          code: `function minWindow(s, t) {
  if (t.length > s.length) return "";
  const need = new Map();
  for (let i = 0; i < t.length; i++) need.set(t[i], (need.get(t[i]) || 0) + 1);
  const have = new Map();
  let formed = 0;
  const needCount = need.size;
  let bestL = 0;
  let bestR = -1;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    have.set(ch, (have.get(ch) || 0) + 1);
    if (need.has(ch) && have.get(ch) === need.get(ch)) formed++;
    while (formed === needCount) {
      if (bestR === -1 || right - left < bestR - bestL) {
        bestL = left;
        bestR = right;
      }
      const drop = s[left];
      have.set(drop, have.get(drop) - 1);
      if (need.has(drop) && have.get(drop) < need.get(drop)) formed--;
      left++;
    }
  }
  return bestR === -1 ? "" : s.slice(bestL, bestR + 1);
}`,
          codes: {
            javascript: `function minWindow(s, t) {
  if (t.length > s.length) return "";
  const need = new Map();
  for (let i = 0; i < t.length; i++) need.set(t[i], (need.get(t[i]) || 0) + 1);
  const have = new Map();
  let formed = 0;
  const needCount = need.size;
  let bestL = 0;
  let bestR = -1;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const ch = s[right];
    have.set(ch, (have.get(ch) || 0) + 1);
    if (need.has(ch) && have.get(ch) === need.get(ch)) formed++;
    while (formed === needCount) {
      if (bestR === -1 || right - left < bestR - bestL) {
        bestL = left;
        bestR = right;
      }
      const drop = s[left];
      have.set(drop, have.get(drop) - 1);
      if (need.has(drop) && have.get(drop) < need.get(drop)) formed--;
      left++;
    }
  }
  return bestR === -1 ? "" : s.slice(bestL, bestR + 1);
}`,
            python: `def min_window(s, t):
    if len(t) > len(s): return ""
    need = {}
    for i in range(len(t)):
        need[t[i]] = need.get(t[i], 0 + 1)
    have = {}
    formed = 0
    needCount = len(need)
    bestL = 0
    bestR = -1
    left = 0
    for right in range(len(s)):

        ch = s[right]
        have[ch] = have.get(ch, 0 + 1)
        if ch in need and have[ch] == need[ch]: formed += 1
        while formed == needCount:
            if bestR == -1 or right - left < bestR - bestL:
                bestL = left
                bestR = right
            drop = s[left]
            have[drop] = have.get(drop - 1)
            if drop in need and have[drop] < need[drop]: formed -= 1
            left += 1

    "" if return bestR == -1 else s[bestL:bestR + 1]`,
            java: `class Solution {
  public String minWindow(String s, String t) {
    if (t.length() > s.length()) return "";
    Map<Character, Integer> need = new HashMap<>();
    for (int i = 0; i < t.length(); i++) need.put(t.charAt(i), (need.getOrDefault(t.charAt(i), 0)) + 1);
    Map<Character, Integer> have = new HashMap<>();
    int formed = 0;
    int needCount = need.size();
    int bestL = 0;
    int bestR = -1;
    int left = 0;
    for (int right = 0; right < s.length(); right++) {
      char ch = s.charAt(right);
      have.put(ch, (have.getOrDefault(ch, 0)) + 1);
      if (need.containsKey(ch) && have.get(ch) == need.get(ch)) formed++;
      while (formed == needCount) {
        if (bestR == -1 || right - left < bestR - bestL) {
          bestL = left;
          bestR = right;
        }
        char drop = s.charAt(left);
        have.put(drop, have.get(drop) - 1);
        if (need.containsKey(drop) && have.get(drop) < need.get(drop)) formed--;
        left++;
      }
    }
    return bestR == -1 ? "" : s.substring(bestL, bestR + 1);
  }
}`,
            cpp: `// vector, unordered_map, string
string minWindow(string s, string t) {
  if ((int)t.size() > (int)s.size()) return "";
  unordered_map<int,int> need;
  for (int i = 0; i < (int)t.size(); i++) need[t[i]] = (need.count(t[i] ? need[t[i]] : 0) + 1);
  unordered_map<int,int> have;
  int formed = 0;
  int needCount = need.size();
  int bestL = 0;
  int bestR = -1;
  int left = 0;
  for (int right = 0; right < (int)s.size(); right++) {
    char ch = s[right];
    have[ch] = (have.count(ch ? have[ch] : 0) + 1);
    if (need.count(ch) && have[ch] == need[ch]) formed++;
    while (formed == needCount) {
      if (bestR == -1 || right - left < bestR - bestL) {
        bestL = left;
        bestR = right;
      }
      char drop = s[left];
      have[drop] = have[drop] - 1;
      if (need.count(drop) && have[drop] < need[drop]) formed--;
      left++;
    }
  }
  return bestR == -1 ? "" : s.substr(bestL, (bestR + 1)-(bestL));
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
void minWindow(char* s, char* t, char* out) {
  if (strlen(t) > strlen(s)) return "";
  int need_keys[1024]; int need_vals[1024]; int need_n = 0;
  for (int i = 0; i < strlen(t); i++) /* set need */ + 1);
  int have_keys[1024]; int have_vals[1024]; int have_n = 0;
  int formed = 0;
  int needCount = need_n;
  int bestL = 0;
  int bestR = -1;
  int left = 0;
  for (int right = 0; right < strlen(s); right++) {
    int ch = s[right];
    /* set have */ + 1);
    if (map_find(need_keys, need_n, ch) >= 0 && have.get(ch) == need.get(ch)) formed++;
    while (formed == needCount) {
      if (bestR == -1 || right - left < bestR - bestL) {
        bestL = left;
        bestR = right;
      }
      int drop = s[left];
      /* set have */ - 1);
      if (map_find(need_keys, need_n, drop) >= 0 && have.get(drop) < need.get(drop)) formed--;
      left++;
    }
  }
  return bestR == -1 ? "" : /* slice s */;
}`
          }
        }
      ]
    },
    {
      id: 12,
      level: "intermediate",
      q: "Longest Repeating Character Replacement",
      ask: "Google · Amazon · Microsoft",
      a: "You may replace at most k characters. Return the length of the longest substring that can become all one letter after those replacements.\n\nExample: s = \"AABABBA\", k = 1 -> 4 (replace the middle B in \"AABA\" or similar).\n\nTrying every window and counting the mode is quadratic. A sliding window that recounts the max frequency each step is O(n*26). You can keep a running maxCount; it never needs to decrease for this length-maximizing problem.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n² · 26)",
          space: "O(1)",
          why: "Every window rebuilds 26 counts and checks whether length - maxCount <= k.\nHow it works: if the letters that are not the most common letter fit in k replacements, the window is valid. Keep the max valid length.",
          code: `function characterReplacement(s, k) {
  let best = 0;
  const n = s.length;
  for (let i = 0; i < n; i++) {
    const count = new Array(26).fill(0);
    let maxCount = 0;
    for (let j = i; j < n; j++) {
      const idx = s.charCodeAt(j) - 65;
      count[idx]++;
      if (count[idx] > maxCount) maxCount = count[idx];
      const len = j - i + 1;
      if (len - maxCount <= k && len > best) best = len;
    }
  }
  return best;
}`,
          codes: {
            javascript: `function characterReplacement(s, k) {
  let best = 0;
  const n = s.length;
  for (let i = 0; i < n; i++) {
    const count = new Array(26).fill(0);
    let maxCount = 0;
    for (let j = i; j < n; j++) {
      const idx = s.charCodeAt(j) - 65;
      count[idx]++;
      if (count[idx] > maxCount) maxCount = count[idx];
      const len = j - i + 1;
      if (len - maxCount <= k && len > best) best = len;
    }
  }
  return best;
}`,
            python: `def character_replacement(s, k):
    best = 0
    n = len(s)
    for i in range(n):

        count = [0] * 26
        maxCount = 0
        for j in range(i, n):

            idx = ord(s[j]) - 65
            count[idx]++
            if count[idx] > maxCount: maxCount = count[idx]
            length = j - i + 1
            if length - maxCount <= k and length > best: best = length

    return best`,
            java: `class Solution {
  public int characterReplacement(String s, int k) {
    int best = 0;
    int n = s.length();
    for (int i = 0; i < n; i++) {
      int[] count = new int[26];
      int maxCount = 0;
      for (int j = i; j < n; j++) {
        int idx = (int)s.charAt(j) - 65;
        count[idx]++;
        if (count[idx] > maxCount) maxCount = count[idx];
        int len = j - i + 1;
        if (len - maxCount <= k && len > best) best = len;
      }
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int characterReplacement(string s, int k) {
  int best = 0;
  int n = (int)s.size();
  for (int i = 0; i < n; i++) {
    vector<int> count = vector<int>(26, 0);
    int maxCount = 0;
    for (int j = i; j < n; j++) {
      int idx = (int)s[j] - 65;
      count[idx]++;
      if (count[idx] > maxCount) maxCount = count[idx];
      int len = j - i + 1;
      if (len - maxCount <= k && len > best) best = len;
    }
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int characterReplacement(char* s, int k) {
  int best = 0;
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    int count = /* zeros 26 */;
    int maxCount = 0;
    for (int j = i; j < n; j++) {
      int idx = (int)s[j] - 65;
      count[idx]++;
      if (count[idx] > maxCount) maxCount = count[idx];
      int len = j - i + 1;
      if (len - maxCount <= k && len > best) best = len;
    }
  }
  return best;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n · 26)",
          space: "O(1)",
          why: "One window. When invalid, left moves and you recompute maxCount by scanning 26 slots.\nHow it works: grow right. While length - maxCount > k, decrement s[left] and recount maxCount. Then update best.",
          code: `function characterReplacement(s, k) {
  const count = new Array(26).fill(0);
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    count[s.charCodeAt(right) - 65]++;
    function maxInCount() {
      let m = 0;
      for (let i = 0; i < 26; i++) if (count[i] > m) m = count[i];
      return m;
    }
    while (right - left + 1 - maxInCount() > k) {
      count[s.charCodeAt(left) - 65]--;
      left++;
    }
    const len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}`,
          codes: {
            javascript: `function characterReplacement(s, k) {
  const count = new Array(26).fill(0);
  let left = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    count[s.charCodeAt(right) - 65]++;
    function maxInCount() {
      let m = 0;
      for (let i = 0; i < 26; i++) if (count[i] > m) m = count[i];
      return m;
    }
    while (right - left + 1 - maxInCount() > k) {
      count[s.charCodeAt(left) - 65]--;
      left++;
    }
    const len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}`,
            python: `def character_replacement(s, k):
    count = [0] * 26
    left = 0
    best = 0
    for right in range(len(s)):

        count[ord(s[right]) - 65]++
        def max_in_count():
            m = 0
            for i in range(26):
                if count[i] > m: m = count[i]
            return m
        while right - left + 1 - max_in_count() > k:
            count[ord(s[left]) - 65]--
            left += 1
        length = right - left + 1
        if length > best: best = length

    return best`,
            java: `class Solution {
  public int characterReplacement(String s, int k) {
    int[] count = new int[26];
    int left = 0;
    int best = 0;
    for (int right = 0; right < s.length(); right++) {
      count[(int)s.charAt(right) - 65]++;
      public void maxInCount() {
        int m = 0;
        for (int i = 0; i < 26; i++) if (count[i] > m) m = count[i];
        return m;
      }
      while (right - left + 1 - maxInCount() > k) {
        count[(int)s.charAt(left) - 65]--;
        left++;
      }
      int len = right - left + 1;
      if (len > best) best = len;
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int characterReplacement(string s, int k) {
  vector<int> count = vector<int>(26, 0);
  int left = 0;
  int best = 0;
  for (int right = 0; right < (int)s.size(); right++) {
    count[(int)s[right] - 65]++;
    auto maxInCount = [&]() {
      int m = 0;
      for (int i = 0; i < 26; i++) if (count[i] > m) m = count[i];
      return m;
    }
    while (right - left + 1 - maxInCount() > k) {
      count[(int)s[left] - 65]--;
      left++;
    }
    int len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int characterReplacement(char* s, int k) {
  int count = /* zeros 26 */;
  int left = 0;
  int best = 0;
  for (int right = 0; right < strlen(s); right++) {
    count[(int)s[right] - 65]++;
    void maxInCount(/*  */) {
      int m = 0;
      for (int i = 0; i < 26; i++) if (count[i] > m) m = count[i];
      return m;
    }
    while (right - left + 1 - maxInCount() > k) {
      count[(int)s[left] - 65]--;
      left++;
    }
    int len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "maxCount only increases when a better majority appears. For the longest window, you never need a smaller maxCount.\nHow it works: grow right, update maxCount. If window is too dirty, move left once (not a while with a rescan). Window size still only grows when valid history allows it.",
          code: `function characterReplacement(s, k) {
  const count = new Array(26).fill(0);
  let left = 0;
  let maxCount = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const idx = s.charCodeAt(right) - 65;
    count[idx]++;
    if (count[idx] > maxCount) maxCount = count[idx];
    if (right - left + 1 - maxCount > k) {
      count[s.charCodeAt(left) - 65]--;
      left++;
    }
    const len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}`,
          codes: {
            javascript: `function characterReplacement(s, k) {
  const count = new Array(26).fill(0);
  let left = 0;
  let maxCount = 0;
  let best = 0;
  for (let right = 0; right < s.length; right++) {
    const idx = s.charCodeAt(right) - 65;
    count[idx]++;
    if (count[idx] > maxCount) maxCount = count[idx];
    if (right - left + 1 - maxCount > k) {
      count[s.charCodeAt(left) - 65]--;
      left++;
    }
    const len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}`,
            python: `def character_replacement(s, k):
    count = [0] * 26
    left = 0
    maxCount = 0
    best = 0
    for right in range(len(s)):

        idx = ord(s[right]) - 65
        count[idx]++
        if count[idx] > maxCount: maxCount = count[idx]
        if right - left + 1 - maxCount > k:
            count[ord(s[left]) - 65]--
            left += 1
        length = right - left + 1
        if length > best: best = length

    return best`,
            java: `class Solution {
  public int characterReplacement(String s, int k) {
    int[] count = new int[26];
    int left = 0;
    int maxCount = 0;
    int best = 0;
    for (int right = 0; right < s.length(); right++) {
      int idx = (int)s.charAt(right) - 65;
      count[idx]++;
      if (count[idx] > maxCount) maxCount = count[idx];
      if (right - left + 1 - maxCount > k) {
        count[(int)s.charAt(left) - 65]--;
        left++;
      }
      int len = right - left + 1;
      if (len > best) best = len;
    }
    return best;
  }
}`,
            cpp: `// vector, unordered_map, string
int characterReplacement(string s, int k) {
  vector<int> count = vector<int>(26, 0);
  int left = 0;
  int maxCount = 0;
  int best = 0;
  for (int right = 0; right < (int)s.size(); right++) {
    int idx = (int)s[right] - 65;
    count[idx]++;
    if (count[idx] > maxCount) maxCount = count[idx];
    if (right - left + 1 - maxCount > k) {
      count[(int)s[left] - 65]--;
      left++;
    }
    int len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}`,
            c: `/* pass n for array length; simple loops */
int characterReplacement(char* s, int k) {
  int count = /* zeros 26 */;
  int left = 0;
  int maxCount = 0;
  int best = 0;
  for (int right = 0; right < strlen(s); right++) {
    int idx = (int)s[right] - 65;
    count[idx]++;
    if (count[idx] > maxCount) maxCount = count[idx];
    if (right - left + 1 - maxCount > k) {
      count[(int)s[left] - 65]--;
      left++;
    }
    int len = right - left + 1;
    if (len > best) best = len;
  }
  return best;
}`
          }
        }
      ]
    },
    {
      id: 13,
      level: "beginner",
      q: "Valid Palindrome II",
      ask: "Meta · Amazon · Google · Microsoft",
      a: "Return true if s can be a palindrome after deleting at most one character.\n\nExample: \"aba\" is true (already a palindrome). Example: \"abca\" is true (delete b or c). Example: \"abc\" is false.\n\nTrying every deletion is O(n²). On the first mismatch, build two candidate strings (skip left vs skip right). Checking those ranges with two pointers and no extra strings is linear and O(1) extra memory.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "n candidate strings after deleting one index, each palindrome check is O(n).\nHow it works: if s is already a palindrome, true. Else for each i, check s without index i.",
          code: `function validPalindrome(s) {
  function isPalin(text) {
    let left = 0;
    let right = text.length - 1;
    while (left < right) {
      if (text[left] !== text[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  if (isPalin(s)) return true;
  for (let i = 0; i < s.length; i++) {
    if (isPalin(s.slice(0, i) + s.slice(i + 1))) return true;
  }
  return false;
}`,
          codes: {
            javascript: `function validPalindrome(s) {
  function isPalin(text) {
    let left = 0;
    let right = text.length - 1;
    while (left < right) {
      if (text[left] !== text[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  if (isPalin(s)) return true;
  for (let i = 0; i < s.length; i++) {
    if (isPalin(s.slice(0, i) + s.slice(i + 1))) return true;
  }
  return false;
}`,
            python: `def valid_palindrome(s):
    def is_palin(text):
        left = 0
        right = len(text) - 1
        while left < right:
            if text[left] != text[right]: return False
            left += 1
            right -= 1
        return True
    if is_palin(s): return True
    for i in range(len(s)):

        if is_palin(s[0:i] + s[i + 1:]): return True

    return False`,
            java: `class Solution {
  public boolean validPalindrome(String s) {
    public void isPalin(text) {
      int left = 0;
      int right = text.length() - 1;
      while (left < right) {
        if (text.charAt(left) != text.charAt(right)) return false;
        left++;
        right--;
      }
      return true;
    }
    if (isPalin(s)) return true;
    for (int i = 0; i < s.length(); i++) {
      if (isPalin(s.substring(0, i) + s.substring(i + 1))) return true;
    }
    return false;
  }
}`,
            cpp: `// vector, unordered_map, string
bool validPalindrome(string s) {
  auto isPalin = [&](text) {
    int left = 0;
    int right = (int)text.size() - 1;
    while (left < right) {
      if (text[left] != text[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  if (isPalin(s)) return true;
  for (int i = 0; i < (int)s.size(); i++) {
    if (isPalin(s.substr(0, (i)-(0)) + s.substr(i + 1))) return true;
  }
  return false;
}`,
            c: `/* pass n for array length; simple loops */
int validPalindrome(char* s) {
  void isPalin(/* text */) {
    int left = 0;
    int right = strlen(text) - 1;
    while (left < right) {
      if (text[left] != text[right]) return 0;
      left++;
      right--;
    }
    return 1;
  }
  if (isPalin(s)) return 1;
  for (int i = 0; i < strlen(s); i++) {
    if (isPalin(/* slice s */ + /* slice s */)) return 1;
  }
  return 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One mismatch, then two extra strings of length n-1.\nHow it works: walk inward. On mismatch, test skip-left and skip-right by slicing. If the whole walk succeeds, no deletion was needed.",
          code: `function validPalindrome(s) {
  function isPalin(text) {
    let left = 0;
    let right = text.length - 1;
    while (left < right) {
      if (text[left] !== text[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) {
      const skipL = s.slice(left + 1, right + 1);
      const skipR = s.slice(left, right);
      return isPalin(skipL) || isPalin(skipR);
    }
    left++;
    right--;
  }
  return true;
}`,
          codes: {
            javascript: `function validPalindrome(s) {
  function isPalin(text) {
    let left = 0;
    let right = text.length - 1;
    while (left < right) {
      if (text[left] !== text[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) {
      const skipL = s.slice(left + 1, right + 1);
      const skipR = s.slice(left, right);
      return isPalin(skipL) || isPalin(skipR);
    }
    left++;
    right--;
  }
  return true;
}`,
            python: `def valid_palindrome(s):
    def is_palin(text):
        left = 0
        right = len(text) - 1
        while left < right:
            if text[left] != text[right]: return False
            left += 1
            right -= 1
        return True
    left = 0
    right = len(s) - 1
    while left < right:
        if s[left] != s[right]:
            skipL = s[left + 1:right + 1]
            skipR = s[left:right]
            return is_palin(skipL) or is_palin(skipR)
        left += 1
        right -= 1
    return True`,
            java: `class Solution {
  public boolean validPalindrome(String s) {
    public void isPalin(text) {
      int left = 0;
      int right = text.length() - 1;
      while (left < right) {
        if (text.charAt(left) != text.charAt(right)) return false;
        left++;
        right--;
      }
      return true;
    }
    int left = 0;
    int right = s.length() - 1;
    while (left < right) {
      if (s.charAt(left) != s.charAt(right)) {
        String skipL = s.substring(left + 1, right + 1);
        String skipR = s.substring(left, right);
        return isPalin(skipL) || isPalin(skipR);
      }
      left++;
      right--;
    }
    return true;
  }
}`,
            cpp: `// vector, unordered_map, string
bool validPalindrome(string s) {
  auto isPalin = [&](text) {
    int left = 0;
    int right = (int)text.size() - 1;
    while (left < right) {
      if (text[left] != text[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  int left = 0;
  int right = (int)s.size() - 1;
  while (left < right) {
    if (s[left] != s[right]) {
      string skipL = s.substr(left + 1, (right + 1)-(left + 1));
      string skipR = s.substr(left, (right)-(left));
      return isPalin(skipL) || isPalin(skipR);
    }
    left++;
    right--;
  }
  return true;
}`,
            c: `/* pass n for array length; simple loops */
int validPalindrome(char* s) {
  void isPalin(/* text */) {
    int left = 0;
    int right = strlen(text) - 1;
    while (left < right) {
      if (text[left] != text[right]) return 0;
      left++;
      right--;
    }
    return 1;
  }
  int left = 0;
  int right = strlen(s) - 1;
  while (left < right) {
    if (s[left] != s[right]) {
      char skipL[1024]; /* /* slice s */ */
      char skipR[1024]; /* /* slice s */ */
      return isPalin(skipL) || isPalin(skipR);
    }
    left++;
    right--;
  }
  return 1;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Range checks use indexes only. No sliced copies.\nHow it works: palin(l,r) checks a range. On the first mismatch, return palin(left+1, right) or palin(left, right-1).",
          code: `function validPalindrome(s) {
  function palin(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) {
      return palin(left + 1, right) || palin(left, right - 1);
    }
    left++;
    right--;
  }
  return true;
}`,
          codes: {
            javascript: `function validPalindrome(s) {
  function palin(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    if (s[left] !== s[right]) {
      return palin(left + 1, right) || palin(left, right - 1);
    }
    left++;
    right--;
  }
  return true;
}`,
            python: `def valid_palindrome(s):
    def palin(left, right):
        while left < right:
            if s[left] != s[right]: return False
            left += 1
            right -= 1
        return True
    left = 0
    right = len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return palin(left + 1, right) or palin(left, right - 1)
        left += 1
        right -= 1
    return True`,
            java: `class Solution {
  public boolean validPalindrome(String s) {
    public void palin(left, right) {
      while (left < right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++;
        right--;
      }
      return true;
    }
    int left = 0;
    int right = s.length() - 1;
    while (left < right) {
      if (s.charAt(left) != s.charAt(right)) {
        return palin(left + 1, right) || palin(left, right - 1);
      }
      left++;
      right--;
    }
    return true;
  }
}`,
            cpp: `// vector, unordered_map, string
bool validPalindrome(string s) {
  auto palin = [&](left, right) {
    while (left < right) {
      if (s[left] != s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  int left = 0;
  int right = (int)s.size() - 1;
  while (left < right) {
    if (s[left] != s[right]) {
      return palin(left + 1, right) || palin(left, right - 1);
    }
    left++;
    right--;
  }
  return true;
}`,
            c: `/* pass n for array length; simple loops */
int validPalindrome(char* s) {
  void palin(/* left, right */) {
    while (left < right) {
      if (s[left] != s[right]) return 0;
      left++;
      right--;
    }
    return 1;
  }
  int left = 0;
  int right = strlen(s) - 1;
  while (left < right) {
    if (s[left] != s[right]) {
      return palin(left + 1, right) || palin(left, right - 1);
    }
    left++;
    right--;
  }
  return 1;
}`
          }
        }
      ]
    },
    {
      id: 14,
      level: "intermediate",
      q: "Encode and Decode Strings",
      ask: "Meta · Google · Amazon · Uber",
      a: "Design encode(strs) -> one string, and decode(that string) -> the original list. Words may contain any characters, including the delimiter you might want to use.\n\nExample: [\"hello\",\"world\"] must round-trip. Example: [\"\",\"#\",\"a#b\"] must also round-trip.\n\nJSON.stringify works as a blunt encoder. Escaping a delimiter also works if you are careful. Length-prefix (len#word) is the usual interview design: decode reads digits, then a slice of that length.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "JSON does the escaping for you. Fine in JS, often not what the interviewer wants to hear as the data-structure answer.\nHow it works: encode is JSON.stringify. decode is JSON.parse. n is total characters.",
          code: `function encode(strs) {
  return JSON.stringify(strs);
}
function decode(s) {
  return JSON.parse(s);
}`,
          codes: {
            javascript: `function encode(strs) {
  return JSON.stringify(strs);
}
function decode(s) {
  return JSON.parse(s);
}`,
            python: `# import json
def encode(strs):
    return json.dumps(strs)
def decode(s):
    return json.loads(s)`,
            java: `class Solution {
  public String encode(String[] strs) {
    return /* json */ strs.toString();
  }
  public List<String> decode(String s) {
    return /* json parse */ s;
  }
}`,
            cpp: `// vector, unordered_map, string
string encode(vector<string>& strs) {
  return JSON.stringify(strs);
}
vector<string> decode(string s) {
  return JSON.parse(s);
}`,
            c: `/* pass n for array length; simple loops */
void encode(char strs[][128], int n, char* out) {
  return JSON.stringify(strs);
}
int decode(char* s, char out[][128]) {
  return JSON.parse(s);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Write a header of counts and lengths, then the raw words glued together. The header cannot be confused with word contents because a single # separates header from body.\nHow it works: header is n, then each word length. Body is the words concatenated. Decode reads n lengths, then slices the body.",
          code: `function encode(strs) {
  let header = String(strs.length);
  for (let i = 0; i < strs.length; i++) {
    header += "," + String(strs[i].length);
  }
  let body = "";
  for (let i = 0; i < strs.length; i++) body += strs[i];
  return header + "#" + body;
}
function decode(s) {
  const hash = s.indexOf("#");
  const parts = s.slice(0, hash).split(",");
  const n = Number(parts[0]);
  const out = [];
  let pos = hash + 1;
  for (let i = 0; i < n; i++) {
    const len = Number(parts[i + 1]);
    out.push(s.slice(pos, pos + len));
    pos += len;
  }
  return out;
}`,
          codes: {
            javascript: `function encode(strs) {
  let header = String(strs.length);
  for (let i = 0; i < strs.length; i++) {
    header += "," + String(strs[i].length);
  }
  let body = "";
  for (let i = 0; i < strs.length; i++) body += strs[i];
  return header + "#" + body;
}
function decode(s) {
  const hash = s.indexOf("#");
  const parts = s.slice(0, hash).split(",");
  const n = Number(parts[0]);
  const out = [];
  let pos = hash + 1;
  for (let i = 0; i < n; i++) {
    const len = Number(parts[i + 1]);
    out.push(s.slice(pos, pos + len));
    pos += len;
  }
  return out;
}`,
            python: `def encode(strs):
    header = str(len(strs))
    for i in range(len(strs)):

        header += "," + str(strs[i].length)

    body = ""
    for i in range(len(strs)):
        body += strs[i]
    return header + "#" + body
def decode(s):
    hash = s.find("#") if isinstance(s, str) else (s.index("#") if "#" in s else -1)
    parts = s[0:hash].split(",")
    n = int(parts[0])
    out = []
    pos = hash + 1
    for i in range(n):

        length = int(parts[i + 1])
        out.append(s[pos:pos + length])
        pos += length

    return out`,
            java: `class Solution {
  public String encode(String[] strs) {
    int header = String.valueOf(strs.length);
    for (int i = 0; i < strs.length; i++) {
      header += "," + String.valueOf(strs[i].length);
    }
    String body = "";
    for (int i = 0; i < strs.length; i++) body += strs[i];
    return header + "#" + body;
  }
  public List<String> decode(String s) {
    int hash = s.indexOf("#");
    String parts = s.substring(0, hash).split(",");
    int n = Integer.parseInt(parts.charAt(0));
    List<Integer> out = new ArrayList<>();
    int pos = hash + 1;
    for (int i = 0; i < n; i++) {
      int len = Integer.parseInt(parts.charAt(i + 1));
      out.add(s.substring(pos, pos + len));
      pos += len;
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
string encode(vector<string>& strs) {
  int header = to_string((int)strs.size());
  for (int i = 0; i < (int)strs.size(); i++) {
    header += "," + to_string(strs[i].length);
  }
  string body = "";
  for (int i = 0; i < (int)strs.size(); i++) body += strs[i];
  return header + "#" + body;
}
vector<string> decode(string s) {
  int hash = (int)s.find("#");
  string parts = s.substr(0, (hash)-(0)).split(",");
  int n = stoi(parts[0]);
  vector<int> out;
  int pos = hash + 1;
  for (int i = 0; i < n; i++) {
    int len = stoi(parts[i + 1]);
    out.push_back(s.substr(pos, (pos + len)-(pos)));
    pos += len;
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
void encode(char strs[][128], int n, char* out) {
  int header = n;
  for (int i = 0; i < n; i++) {
    header += "," + strs[i].length;
  }
  char body[1024]; /* "" */
  for (int i = 0; i < n; i++) body += strs[i];
  return header + "#" + body;
}
int decode(char* s, char out[][128]) {
  int hash = /* indexOf */;
  char parts[1024]; /* /* slice s */.split(",") */
  int n = atoi(parts[0]);
  int out[1024]; int out_n = 0;
  int pos = hash + 1;
  for (int i = 0; i < n; i++) {
    int len = atoi(parts[i + 1]);
    /* push */(/* slice s */);
    pos += len;
  }
  return out;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(n)",
          why: "No escaping rules to get wrong. Length is written in decimal, then \"#\", then raw characters. Decode cannot confuse \"#\" inside a word because length tells you how far to slice.\nHow it works: encode concatenates String(len) + \"#\" + word. decode finds \"#\", parses len, slices the next len chars.",
          code: `function encode(strs) {
  let out = "";
  for (let i = 0; i < strs.length; i++) {
    out += String(strs[i].length) + "#" + strs[i];
  }
  return out;
}
function decode(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    let j = i;
    while (s[j] !== "#") j++;
    const len = Number(s.slice(i, j));
    const word = s.slice(j + 1, j + 1 + len);
    out.push(word);
    i = j + 1 + len;
  }
  return out;
}`,
          codes: {
            javascript: `function encode(strs) {
  let out = "";
  for (let i = 0; i < strs.length; i++) {
    out += String(strs[i].length) + "#" + strs[i];
  }
  return out;
}
function decode(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    let j = i;
    while (s[j] !== "#") j++;
    const len = Number(s.slice(i, j));
    const word = s.slice(j + 1, j + 1 + len);
    out.push(word);
    i = j + 1 + len;
  }
  return out;
}`,
            python: `def encode(strs):
    out = ""
    for i in range(len(strs)):

        out += str(strs[i].length) + "#" + strs[i]

    return out
def decode(s):
    out = []
    i = 0
    while i < len(s):
        j = i
        while s[j] != "#": j += 1
        length = int(s[i:j])
        word = s[j + 1:j + 1 + length]
        out.append(word)
        i = j + 1 + length
    return out`,
            java: `class Solution {
  public String encode(String[] strs) {
    String out = "";
    for (int i = 0; i < strs.length; i++) {
      out += String.valueOf(strs[i].length) + "#" + strs[i];
    }
    return out;
  }
  public List<String> decode(String s) {
    List<Integer> out = new ArrayList<>();
    int i = 0;
    while (i < s.length()) {
      int j = i;
      while (s.charAt(j) != "#") j++;
      String len = Integer.parseInt(s.substring(i, j));
      String word = s.substring(j + 1, j + 1 + len);
      out.add(word);
      i = j + 1 + len;
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
string encode(vector<string>& strs) {
  string out = "";
  for (int i = 0; i < (int)strs.size(); i++) {
    out += to_string(strs[i].length) + "#" + strs[i];
  }
  return out;
}
vector<string> decode(string s) {
  vector<int> out;
  int i = 0;
  while (i < (int)s.size()) {
    int j = i;
    while (s[j] != "#") j++;
    string len = stoi(s.substr(i, (j)-(i)));
    string word = s.substr(j + 1, (j + 1 + len)-(j + 1));
    out.push_back(word);
    i = j + 1 + len;
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
void encode(char strs[][128], int n, char* out) {
  char out[1024]; /* "" */
  for (int i = 0; i < n; i++) {
    out += strs[i].length + "#" + strs[i];
  }
  return out;
}
int decode(char* s, char out[][128]) {
  int out[1024]; int out_n = 0;
  int i = 0;
  while (i < strlen(s)) {
    int j = i;
    while (s[j] != "#") j++;
    char len[1024]; /* atoi(/* slice s */) */
    char word[1024]; /* /* slice s */ */
    /* push */(word);
    i = j + 1 + len;
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
      q: "Word Break",
      ask: "Amazon · Google · Meta · Apple",
      a: "Return true if s can be split into a sequence of dictionary words. Words may be reused. Order in wordDict does not matter.\n\nExample: s = \"leetcode\", wordDict = [\"leet\",\"code\"] is true. Example: \"catsandog\" with [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"] is false.\n\nTrying every split recursively is exponential. A boolean DP array ok[i] means s[0..i) can be broken. Combining DP with a Set and a max word length avoids scanning impossible slices.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(2ⁿ)",
          space: "O(n)",
          why: "Each position may start many words. Overlapping failures are recomputed. Stack depth is O(n).\nHow it works: dfs(i) is true if i is the end, or some wordDict entry matches s starting at i and dfs continues after it.",
          code: `function wordBreak(s, wordDict) {
  function dfs(i) {
    if (i === s.length) return true;
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.slice(i, i + word.length) === word && dfs(i + word.length)) return true;
    }
    return false;
  }
  return dfs(0);
}`,
          codes: {
            javascript: `function wordBreak(s, wordDict) {
  function dfs(i) {
    if (i === s.length) return true;
    for (let w = 0; w < wordDict.length; w++) {
      const word = wordDict[w];
      if (s.slice(i, i + word.length) === word && dfs(i + word.length)) return true;
    }
    return false;
  }
  return dfs(0);
}`,
            python: `def word_break(s, wordDict):
    def dfs(i):
        if i == len(s): return True
        for w in range(len(wordDict)):

            word = wordDict[w]
            if s[i:i + len(word)] == word and dfs(i + len(word)): return True

        return False
    return dfs(0)`,
            java: `class Solution {
  public boolean wordBreak(String s, List<String> wordDict) {
    public void dfs(i) {
      if (i == s.length()) return true;
      for (int w = 0; w < wordDict.length; w++) {
        String word = wordDict[w];
        if (s.substring(i, i + word.length()) == word && dfs(i + word.length())) return true;
      }
      return false;
    }
    return dfs(0);
  }
}`,
            cpp: `// vector, unordered_map, string
bool wordBreak(string s, vector<string>& wordDict) {
  auto dfs = [&](i) {
    if (i == (int)s.size()) return true;
    for (int w = 0; w < (int)wordDict.size(); w++) {
      string word = wordDict[w];
      if (s.substr(i, (i + (int)word.size())-(i)) == word && dfs(i + (int)word.size())) return true;
    }
    return false;
  }
  return dfs(0);
}`,
            c: `/* pass n for array length; simple loops */
int wordBreak(char* s, char wordDict[][64], int wn) {
  void dfs(/* i */) {
    if (i == strlen(s)) return 1;
    for (int w = 0; w < n; w++) {
      char word[1024]; /* wordDict[w] */
      if (/* slice s */ == word && dfs(i + strlen(word))) return 1;
    }
    return 0;
  }
  return dfs(0);
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n² · k)",
          space: "O(n)",
          why: "ok[i] loops previous starts and slices. k is cost of string compare / slice.\nHow it works: ok[0] = true. ok[j] is true if some i < j has ok[i] and s.slice(i,j) is in the dictionary Set.",
          code: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const n = s.length;
  const ok = new Array(n + 1).fill(false);
  ok[0] = true;
  for (let j = 1; j <= n; j++) {
    for (let i = 0; i < j; i++) {
      if (ok[i] && words.has(s.slice(i, j))) {
        ok[j] = true;
        break;
      }
    }
  }
  return ok[n];
}`,
          codes: {
            javascript: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  const n = s.length;
  const ok = new Array(n + 1).fill(false);
  ok[0] = true;
  for (let j = 1; j <= n; j++) {
    for (let i = 0; i < j; i++) {
      if (ok[i] && words.has(s.slice(i, j))) {
        ok[j] = true;
        break;
      }
    }
  }
  return ok[n];
}`,
            python: `def word_break(s, wordDict):
    words = set(wordDict)
    n = len(s)
    ok = [None] * (n + 1).fill(False)
    ok[0] = True
    for j in range(1, = n):

        for i in range(j):

            if ok[i] and s[i:j] in words:
                ok[j] = True
                break

    return ok[n]`,
            java: `class Solution {
  public boolean wordBreak(String s, List<String> wordDict) {
    Set<Integer> words = new HashSet<>();
    int n = s.length();
    boolean[] ok = new int[n + 1].fill(false);
    ok[0] = true;
    for (int j = 1; j <= n; j++) {
      for (int i = 0; i < j; i++) {
        if (ok[i] && words.contains(s.substring(i, j))) {
          ok[j] = true;
          break;
        }
      }
    }
    return ok[n];
  }
}`,
            cpp: `// vector, unordered_map, string
bool wordBreak(string s, vector<string>& wordDict) {
  unordered_set<int> words;
  int n = (int)s.size();
  vector<int> ok = vector<int>(n + 1).fill(false);
  ok[0] = true;
  for (int j = 1; j <= n; j++) {
    for (int i = 0; i < j; i++) {
      if (ok[i] && words.count(s.substr(i, (j)-(i)))) {
        ok[j] = true;
        break;
      }
    }
  }
  return ok[n];
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int wordBreak(char* s, char wordDict[][64], int wn) {
  int words_keys[1024]; int words_n = 0;
  /* n is the given length */
  int ok = /* array n + 1 */.fill(0);
  ok[0] = 1;
  for (int j = 1; j <= n; j++) {
    for (int i = 0; i < j; i++) {
      if (ok[i] && map_find(words_keys, words_n, /* slice s */) >= 0) {
        ok[j] = 1;
        break;
      }
    }
  }
  return ok[n];
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n · L)",
          space: "O(n)",
          why: "From each true index i, only try lengths 1..longest word, not every j. L is that max length times slice cost, still typically much less than n for each i.\nHow it works: same ok array. If ok[i], try each length up to longest. If the slice is a word, mark ok[i+len].",
          code: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  let longest = 0;
  for (let w = 0; w < wordDict.length; w++) {
    if (wordDict[w].length > longest) longest = wordDict[w].length;
  }
  const n = s.length;
  const ok = new Array(n + 1).fill(false);
  ok[0] = true;
  for (let i = 0; i < n; i++) {
    if (!ok[i]) continue;
    for (let len = 1; len <= longest && i + len <= n; len++) {
      if (words.has(s.slice(i, i + len))) ok[i + len] = true;
    }
  }
  return ok[n];
}`,
          codes: {
            javascript: `function wordBreak(s, wordDict) {
  const words = new Set(wordDict);
  let longest = 0;
  for (let w = 0; w < wordDict.length; w++) {
    if (wordDict[w].length > longest) longest = wordDict[w].length;
  }
  const n = s.length;
  const ok = new Array(n + 1).fill(false);
  ok[0] = true;
  for (let i = 0; i < n; i++) {
    if (!ok[i]) continue;
    for (let len = 1; len <= longest && i + len <= n; len++) {
      if (words.has(s.slice(i, i + len))) ok[i + len] = true;
    }
  }
  return ok[n];
}`,
            python: `def word_break(s, wordDict):
    words = set(wordDict)
    longest = 0
    for w in range(len(wordDict)):

        if wordDict[w].length > longest: longest = wordDict[w].length

    n = len(s)
    ok = [None] * (n + 1).fill(False)
    ok[0] = True
    for i in range(n):

        if not ok[i]: continue
        for length in range(1, = longest and i + length <= n):

            if s[i:i + length] in words: ok[i + length] = True

    return ok[n]`,
            java: `class Solution {
  public boolean wordBreak(String s, List<String> wordDict) {
    Set<Integer> words = new HashSet<>();
    int longest = 0;
    for (int w = 0; w < wordDict.length; w++) {
      if (wordDict[w].length > longest) longest = wordDict[w].length;
    }
    int n = s.length();
    boolean[] ok = new int[n + 1].fill(false);
    ok[0] = true;
    for (int i = 0; i < n; i++) {
      if (!ok[i]) continue;
      for (int len = 1; len <= longest && i + len <= n; len++) {
        if (words.contains(s.substring(i, i + len))) ok[i + len] = true;
      }
    }
    return ok[n];
  }
}`,
            cpp: `// vector, unordered_map, string
bool wordBreak(string s, vector<string>& wordDict) {
  unordered_set<int> words;
  int longest = 0;
  for (int w = 0; w < (int)wordDict.size(); w++) {
    if (wordDict[w].length > longest) longest = wordDict[w].length;
  }
  int n = (int)s.size();
  vector<int> ok = vector<int>(n + 1).fill(false);
  ok[0] = true;
  for (int i = 0; i < n; i++) {
    if (!ok[i]) continue;
    for (int len = 1; len <= longest && i + len <= n; len++) {
      if (words.count(s.substr(i, (i + len)-(i)))) ok[i + len] = true;
    }
  }
  return ok[n];
}`,
            c: `/* pass n for array length; simple loops */
/* linear scan stands in for a hash map */
int map_find(int* keys, int used, int key) {
  int i;
  for (i = 0; i < used; i++) if (keys[i] == key) return i;
  return -1;
}
int wordBreak(char* s, char wordDict[][64], int wn) {
  int words_keys[1024]; int words_n = 0;
  int longest = 0;
  for (int w = 0; w < n; w++) {
    if (wordDict[w].length > longest) longest = wordDict[w].length;
  }
  /* n is the given length */
  int ok = /* array n + 1 */.fill(0);
  ok[0] = 1;
  for (int i = 0; i < n; i++) {
    if (!ok[i]) continue;
    for (int len = 1; len <= longest && i + len <= n; len++) {
      if (map_find(words_keys, words_n, /* slice s */) >= 0) ok[i + len] = 1;
    }
  }
  return ok[n];
}`
          }
        }
      ]
    },
    {
      id: 16,
      level: "intermediate",
      q: "Palindromic Substrings",
      ask: "Meta · Amazon · Google · Microsoft",
      a: "Count how many palindromic substrings s has. Single letters count. Different indexes count as different even if the text matches.\n\nExample: \"abc\" -> 3. Example: \"aaa\" -> 6.\n\nCheck every substring. A boolean DP table pal[i][j] fills by length. Expanding around centers counts without the n² table.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n³)",
          space: "O(1)",
          why: "O(n²) ranges, each palindrome test O(n).\nHow it works: for every i..j, two-pointer check. Increment count when it is a palindrome.",
          code: `function countSubstrings(s) {
  function isPalin(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  let count = 0;
  const n = s.length;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (isPalin(i, j)) count++;
    }
  }
  return count;
}`,
          codes: {
            javascript: `function countSubstrings(s) {
  function isPalin(left, right) {
    while (left < right) {
      if (s[left] !== s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  let count = 0;
  const n = s.length;
  for (let i = 0; i < n; i++) {
    for (let j = i; j < n; j++) {
      if (isPalin(i, j)) count++;
    }
  }
  return count;
}`,
            python: `def count_substrings(s):
    def is_palin(left, right):
        while left < right:
            if s[left] != s[right]: return False
            left += 1
            right -= 1
        return True
    count = 0
    n = len(s)
    for i in range(n):

        for j in range(i, n):

            if is_palin(i, j): count += 1

    return count`,
            java: `class Solution {
  public int countSubstrings(String s) {
    public void isPalin(left, right) {
      while (left < right) {
        if (s.charAt(left) != s.charAt(right)) return false;
        left++;
        right--;
      }
      return true;
    }
    int count = 0;
    int n = s.length();
    for (int i = 0; i < n; i++) {
      for (int j = i; j < n; j++) {
        if (isPalin(i, j)) count++;
      }
    }
    return count;
  }
}`,
            cpp: `// vector, unordered_map, string
int countSubstrings(string s) {
  auto isPalin = [&](left, right) {
    while (left < right) {
      if (s[left] != s[right]) return false;
      left++;
      right--;
    }
    return true;
  }
  int count = 0;
  int n = (int)s.size();
  for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
      if (isPalin(i, j)) count++;
    }
  }
  return count;
}`,
            c: `/* pass n for array length; simple loops */
int countSubstrings(char* s) {
  void isPalin(/* left, right */) {
    while (left < right) {
      if (s[left] != s[right]) return 0;
      left++;
      right--;
    }
    return 1;
  }
  int count = 0;
  /* n is the given length */
  for (int i = 0; i < n; i++) {
    for (int j = i; j < n; j++) {
      if (isPalin(i, j)) count++;
    }
  }
  return count;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n²)",
          space: "O(n²)",
          why: "A boolean table of n by n. Each cell is O(1) after shorter lengths are known.\nHow it works: pal[i][j] is true if s[i]===s[j] and the inside is a palindrome (or the length is 1 or 2). Count every true cell.",
          code: `function countSubstrings(s) {
  const n = s.length;
  const pal = [];
  for (let i = 0; i < n; i++) pal.push(new Array(n).fill(false));
  let count = 0;
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1])) {
        pal[i][j] = true;
        count++;
      }
    }
  }
  return count;
}`,
          codes: {
            javascript: `function countSubstrings(s) {
  const n = s.length;
  const pal = [];
  for (let i = 0; i < n; i++) pal.push(new Array(n).fill(false));
  let count = 0;
  for (let i = n - 1; i >= 0; i--) {
    for (let j = i; j < n; j++) {
      if (s[i] === s[j] && (j - i < 2 || pal[i + 1][j - 1])) {
        pal[i][j] = true;
        count++;
      }
    }
  }
  return count;
}`,
            python: `def count_substrings(s):
    n = len(s)
    pal = []
    for i in range(n):
        pal.append([False] * n)
    count = 0
    for i in range(n - 1, (0) - 1, -1):

        for j in range(i, n):

            if s[i] == s[j] and (j - i < 2 or pal[i + 1][j - 1]):
                pal[i][j] = True
                count += 1

    return count`,
            java: `class Solution {
  public int countSubstrings(String s) {
    int n = s.length();
    List<Integer> pal = new ArrayList<>();
    for (int i = 0; i < n; i++) pal.add(new boolean[n]);
    int count = 0;
    for (int i = n - 1; i >= 0; i--) {
      for (int j = i; j < n; j++) {
        if (s.charAt(i) == s.charAt(j) && (j - i < 2 || pal[i + 1][j - 1])) {
          pal[i][j] = true;
          count++;
        }
      }
    }
    return count;
  }
}`,
            cpp: `// vector, unordered_map, string
int countSubstrings(string s) {
  int n = (int)s.size();
  vector<int> pal;
  for (int i = 0; i < n; i++) pal.push_back(vector<int>(n, 0));
  int count = 0;
  for (int i = n - 1; i >= 0; i--) {
    for (int j = i; j < n; j++) {
      if (s[i] == s[j] && (j - i < 2 || pal[i + 1][j - 1])) {
        pal[i][j] = true;
        count++;
      }
    }
  }
  return count;
}`,
            c: `/* pass n for array length; simple loops */
int countSubstrings(char* s) {
  /* n is the given length */
  int pal[1024]; int pal_n = 0;
  for (int i = 0; i < n; i++) /* push */(/* zeros n */);
  int count = 0;
  for (int i = n - 1; i >= 0; i--) {
    for (int j = i; j < n; j++) {
      if (s[i] == s[j] && (j - i < 2 || pal[i + 1][j - 1])) {
        pal[i][j] = 1;
        count++;
      }
    }
  }
  return count;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n²)",
          space: "O(1)",
          why: "Same time, constant extra memory. Each palindrome is grown from a center.\nHow it works: expand(left,right) counts while the letters match. Call expand(i,i) and expand(i,i+1) for every i.",
          code: `function countSubstrings(s) {
  let count = 0;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count++;
      left--;
      right++;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return count;
}`,
          codes: {
            javascript: `function countSubstrings(s) {
  let count = 0;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      count++;
      left--;
      right++;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return count;
}`,
            python: `def count_substrings(s):
    count = 0
    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
    for i in range(len(s)):

        expand(i, i)
        expand(i, i + 1)

    return count`,
            java: `class Solution {
  public int countSubstrings(String s) {
    int count = 0;
    public void expand(left, right) {
      while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        count++;
        left--;
        right++;
      }
    }
    for (int i = 0; i < s.length(); i++) {
      expand(i, i);
      expand(i, i + 1);
    }
    return count;
  }
}`,
            cpp: `// vector, unordered_map, string
int countSubstrings(string s) {
  int count = 0;
  auto expand = [&](left, right) {
    while (left >= 0 && right < (int)s.size() && s[left] == s[right]) {
      count++;
      left--;
      right++;
    }
  }
  for (int i = 0; i < (int)s.size(); i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return count;
}`,
            c: `/* pass n for array length; simple loops */
int countSubstrings(char* s) {
  int count = 0;
  void expand(/* left, right */) {
    while (left >= 0 && right < strlen(s) && s[left] == s[right]) {
      count++;
      left--;
      right++;
    }
  }
  for (int i = 0; i < strlen(s); i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return count;
}`
          }
        }
      ]
    },
    {
      id: 17,
      level: "beginner",
      q: "Roman to Integer",
      ask: "Amazon · Google · Microsoft · Adobe",
      a: "Convert a Roman numeral to an integer. Subtractive pairs: IV=4, IX=9, XL=40, XC=90, CD=400, CM=900. Otherwise add each letter’s value.\n\nExample: \"MCMXCIV\" -> 1994 (M + CM + XC + IV).\n\nReplacing subtractive pairs first, then summing, works. Looking one character ahead in a loop is cleaner. A single rule: if the current value is less than the next, subtract it, otherwise add it.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "You copy the string and rewrite pairs, then sum. Extra string memory.\nHow it works: replace CM, CD, XC, XL, IX, IV with single tokens, then add a map of remaining symbols including those tokens.",
          code: `function romanToInt(s) {
  let t = s;
  t = t.split("CM").join("a");
  t = t.split("CD").join("b");
  t = t.split("XC").join("c");
  t = t.split("XL").join("d");
  t = t.split("IX").join("e");
  t = t.split("IV").join("f");
  const val = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1, a: 900, b: 400, c: 90, d: 40, e: 9, f: 4 };
  let sum = 0;
  for (let i = 0; i < t.length; i++) sum += val[t[i]];
  return sum;
}`,
          codes: {
            javascript: `function romanToInt(s) {
  let t = s;
  t = t.split("CM").join("a");
  t = t.split("CD").join("b");
  t = t.split("XC").join("c");
  t = t.split("XL").join("d");
  t = t.split("IX").join("e");
  t = t.split("IV").join("f");
  const val = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1, a: 900, b: 400, c: 90, d: 40, e: 9, f: 4 };
  let sum = 0;
  for (let i = 0; i < t.length; i++) sum += val[t[i]];
  return sum;
}`,
            python: `def roman_to_int(s):
    t = s
    t = list(t) if "CM" == "" else t.split("CM").join("a")
    t = list(t) if "CD" == "" else t.split("CD").join("b")
    t = list(t) if "XC" == "" else t.split("XC").join("c")
    t = list(t) if "XL" == "" else t.split("XL").join("d")
    t = list(t) if "IX" == "" else t.split("IX").join("e")
    t = list(t) if "IV" == "" else t.split("IV").join("f")
    val = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1, a: 900, b: 400, c: 90, d: 40, e: 9, f: 4 }
    sum = 0
    for i in range(len(t)):
        sum += val[t[i]]
    return sum`,
            java: `class Solution {
  public int romanToInt(String s) {
    int t = s;
    t = t.split("CM").join("a");
    t = t.split("CD").join("b");
    t = t.split("XC").join("c");
    t = t.split("XL").join("d");
    t = t.split("IX").join("e");
    t = t.split("IV").join("f");
    int val = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1, a: 900, b: 400, c: 90, d: 40, e: 9, f: 4 };
    int sum = 0;
    for (int i = 0; i < t.length; i++) sum += val[t[i]];
    return sum;
  }
}`,
            cpp: `// vector, unordered_map, string
int romanToInt(string s) {
  int t = s;
  t = /* split t */.join("a");
  t = /* split t */.join("b");
  t = /* split t */.join("c");
  t = /* split t */.join("d");
  t = /* split t */.join("e");
  t = /* split t */.join("f");
  int val = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1, a: 900, b: 400, c: 90, d: 40, e: 9, f: 4 };
  int sum = 0;
  for (int i = 0; i < (int)t.size(); i++) sum += val[t[i]];
  return sum;
}`,
            c: `/* pass n for array length; simple loops */
int romanToInt(char* s) {
  int t = s;
  t = /* split t */.join("a");
  t = /* split t */.join("b");
  t = /* split t */.join("c");
  t = /* split t */.join("d");
  t = /* split t */.join("e");
  t = /* split t */.join("f");
  int val = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1, a: 900, b: 400, c: 90, d: 40, e: 9, f: 4 };
  int sum = 0;
  for (int i = 0; i < t_len; i++) sum += val[t[i]];
  return sum;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(1)",
          why: "One pass, a fixed map. When a subtractive pair is seen, add the pair value and skip two characters.\nHow it works: if val[s[i]] < val[s[i+1]], add the difference and i += 2. Else add val[s[i]] and i += 1.",
          code: `function romanToInt(s) {
  const val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let sum = 0;
  let i = 0;
  while (i < s.length) {
    const cur = val[s[i]];
    const next = i + 1 < s.length ? val[s[i + 1]] : 0;
    if (cur < next) {
      sum += next - cur;
      i += 2;
    } else {
      sum += cur;
      i += 1;
    }
  }
  return sum;
}`,
          codes: {
            javascript: `function romanToInt(s) {
  const val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let sum = 0;
  let i = 0;
  while (i < s.length) {
    const cur = val[s[i]];
    const next = i + 1 < s.length ? val[s[i + 1]] : 0;
    if (cur < next) {
      sum += next - cur;
      i += 2;
    } else {
      sum += cur;
      i += 1;
    }
  }
  return sum;
}`,
            python: `def roman_to_int(s):
    val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
    sum = 0
    i = 0
    while i < len(s):
        cur = val[s[i]]
        val[s[i + 1]] if next = i + 1 < len(s) else 0
        if cur < next:
            sum += next - cur
            i += 2
        else:
            sum += cur
            i += 1
    return sum`,
            java: `class Solution {
  public int romanToInt(String s) {
    int val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    int sum = 0;
    int i = 0;
    while (i < s.length()) {
      int cur = val[s[i]];
      int next = i + 1 < s.length() ? val[s[i + 1]] : 0;
      if (cur < next) {
        sum += next - cur;
        i += 2;
      } else {
        sum += cur;
        i += 1;
      }
    }
    return sum;
  }
}`,
            cpp: `// vector, unordered_map, string
int romanToInt(string s) {
  int val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  int sum = 0;
  int i = 0;
  while (i < (int)s.size()) {
    int cur = val[s[i]];
    int next = i + 1 < (int)s.size() ? val[s[i + 1]] : 0;
    if (cur < next) {
      sum += next - cur;
      i += 2;
    } else {
      sum += cur;
      i += 1;
    }
  }
  return sum;
}`,
            c: `/* pass n for array length; simple loops */
int romanToInt(char* s) {
  int val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  int sum = 0;
  int i = 0;
  while (i < strlen(s)) {
    int cur = val[s[i]];
    int next = i + 1 < strlen(s) ? val[s[i + 1]] : 0;
    if (cur < next) {
      sum += next - cur;
      i += 2;
    } else {
      sum += cur;
      i += 1;
    }
  }
  return sum;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Same linear scan, no skip logic: always add the current value, but subtract it instead when it is smaller than the next.\nHow it works: for each i, if val[s[i]] < val[s[i+1]] then sum -= val[s[i]], else sum += val[s[i]].",
          code: `function romanToInt(s) {
  const val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = val[s[i]];
    const next = i + 1 < s.length ? val[s[i + 1]] : 0;
    if (cur < next) sum -= cur;
    else sum += cur;
  }
  return sum;
}`,
          codes: {
            javascript: `function romanToInt(s) {
  const val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let sum = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = val[s[i]];
    const next = i + 1 < s.length ? val[s[i + 1]] : 0;
    if (cur < next) sum -= cur;
    else sum += cur;
  }
  return sum;
}`,
            python: `def roman_to_int(s):
    val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
    sum = 0
    for i in range(len(s)):

        cur = val[s[i]]
        val[s[i + 1]] if next = i + 1 < len(s) else 0
        if cur < next: sum -= cur
        else: sum += cur

    return sum`,
            java: `class Solution {
  public int romanToInt(String s) {
    int val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    int sum = 0;
    for (int i = 0; i < s.length(); i++) {
      int cur = val[s[i]];
      int next = i + 1 < s.length() ? val[s[i + 1]] : 0;
      if (cur < next) sum -= cur;
      else sum += cur;
    }
    return sum;
  }
}`,
            cpp: `// vector, unordered_map, string
int romanToInt(string s) {
  int val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  int sum = 0;
  for (int i = 0; i < (int)s.size(); i++) {
    int cur = val[s[i]];
    int next = i + 1 < (int)s.size() ? val[s[i + 1]] : 0;
    if (cur < next) sum -= cur;
    else sum += cur;
  }
  return sum;
}`,
            c: `/* pass n for array length; simple loops */
int romanToInt(char* s) {
  int val = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  int sum = 0;
  for (int i = 0; i < strlen(s); i++) {
    int cur = val[s[i]];
    int next = i + 1 < strlen(s) ? val[s[i + 1]] : 0;
    if (cur < next) sum -= cur;
    else sum += cur;
  }
  return sum;
}`
          }
        }
      ]
    },
    {
      id: 18,
      level: "intermediate",
      q: "Integer to Roman",
      ask: "Amazon · Google · Microsoft · Adobe",
      a: "Convert an integer 1..3999 to Roman numerals using the standard symbols, including subtractive forms IV, IX, XL, XC, CD, CM.\n\nExample: 1994 -> \"MCMXCIV\".\n\nNested while loops per symbol work. A parallel list of values and glyphs from 1000 down to 1 is the usual greedy table. The compact table already includes 900, 400, 90, 40, 9, 4 so you never special-case those.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(1)",
          space: "O(1)",
          why: "The input is at most 3999, so the number of appended symbols is bounded. Separate while loops per unit are verbose.\nHow it works: peel thousands as M, then hundreds with C/D/CM/CD, then tens, then ones, with explicit ifs for 9 and 4.",
          code: `function intToRoman(num) {
  let n = num;
  let out = "";
  while (n >= 1000) { out += "M"; n -= 1000; }
  if (n >= 900) { out += "CM"; n -= 900; }
  if (n >= 500) { out += "D"; n -= 500; }
  if (n >= 400) { out += "CD"; n -= 400; }
  while (n >= 100) { out += "C"; n -= 100; }
  if (n >= 90) { out += "XC"; n -= 90; }
  if (n >= 50) { out += "L"; n -= 50; }
  if (n >= 40) { out += "XL"; n -= 40; }
  while (n >= 10) { out += "X"; n -= 10; }
  if (n >= 9) { out += "IX"; n -= 9; }
  if (n >= 5) { out += "V"; n -= 5; }
  if (n >= 4) { out += "IV"; n -= 4; }
  while (n >= 1) { out += "I"; n -= 1; }
  return out;
}`,
          codes: {
            javascript: `function intToRoman(num) {
  let n = num;
  let out = "";
  while (n >= 1000) { out += "M"; n -= 1000; }
  if (n >= 900) { out += "CM"; n -= 900; }
  if (n >= 500) { out += "D"; n -= 500; }
  if (n >= 400) { out += "CD"; n -= 400; }
  while (n >= 100) { out += "C"; n -= 100; }
  if (n >= 90) { out += "XC"; n -= 90; }
  if (n >= 50) { out += "L"; n -= 50; }
  if (n >= 40) { out += "XL"; n -= 40; }
  while (n >= 10) { out += "X"; n -= 10; }
  if (n >= 9) { out += "IX"; n -= 9; }
  if (n >= 5) { out += "V"; n -= 5; }
  if (n >= 4) { out += "IV"; n -= 4; }
  while (n >= 1) { out += "I"; n -= 1; }
  return out;
}`,
            python: `def int_to_roman(num):
    n = num
    out = ""
    while n >= 1000: { out += "M" n -= 1000 }
    if n >= 900: { out += "CM" n -= 900 }
    if n >= 500: { out += "D" n -= 500 }
    if n >= 400: { out += "CD" n -= 400 }
    while n >= 100: { out += "C" n -= 100 }
    if n >= 90: { out += "XC" n -= 90 }
    if n >= 50: { out += "L" n -= 50 }
    if n >= 40: { out += "XL" n -= 40 }
    while n >= 10: { out += "X" n -= 10 }
    if n >= 9: { out += "IX" n -= 9 }
    if n >= 5: { out += "V" n -= 5 }
    if n >= 4: { out += "IV" n -= 4 }
    while n >= 1: { out += "I" n -= 1 }
    return out`,
            java: `class Solution {
  public String intToRoman(int num) {
    int n = num;
    String out = "";
    while (n >= 1000) { out += "M"; n -= 1000; }
    if (n >= 900) { out += "CM"; n -= 900; }
    if (n >= 500) { out += "D"; n -= 500; }
    if (n >= 400) { out += "CD"; n -= 400; }
    while (n >= 100) { out += "C"; n -= 100; }
    if (n >= 90) { out += "XC"; n -= 90; }
    if (n >= 50) { out += "L"; n -= 50; }
    if (n >= 40) { out += "XL"; n -= 40; }
    while (n >= 10) { out += "X"; n -= 10; }
    if (n >= 9) { out += "IX"; n -= 9; }
    if (n >= 5) { out += "V"; n -= 5; }
    if (n >= 4) { out += "IV"; n -= 4; }
    while (n >= 1) { out += "I"; n -= 1; }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
string intToRoman(int num) {
  int n = num;
  string out = "";
  while (n >= 1000) { out += "M"; n -= 1000; }
  if (n >= 900) { out += "CM"; n -= 900; }
  if (n >= 500) { out += "D"; n -= 500; }
  if (n >= 400) { out += "CD"; n -= 400; }
  while (n >= 100) { out += "C"; n -= 100; }
  if (n >= 90) { out += "XC"; n -= 90; }
  if (n >= 50) { out += "L"; n -= 50; }
  if (n >= 40) { out += "XL"; n -= 40; }
  while (n >= 10) { out += "X"; n -= 10; }
  if (n >= 9) { out += "IX"; n -= 9; }
  if (n >= 5) { out += "V"; n -= 5; }
  if (n >= 4) { out += "IV"; n -= 4; }
  while (n >= 1) { out += "I"; n -= 1; }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
void intToRoman(int num, char* out) {
  int n = num;
  char out[1024]; /* "" */
  while (n >= 1000) { out += "M"; n -= 1000; }
  if (n >= 900) { out += "CM"; n -= 900; }
  if (n >= 500) { out += "D"; n -= 500; }
  if (n >= 400) { out += "CD"; n -= 400; }
  while (n >= 100) { out += "C"; n -= 100; }
  if (n >= 90) { out += "XC"; n -= 90; }
  if (n >= 50) { out += "L"; n -= 50; }
  if (n >= 40) { out += "XL"; n -= 40; }
  while (n >= 10) { out += "X"; n -= 10; }
  if (n >= 9) { out += "IX"; n -= 9; }
  if (n >= 5) { out += "V"; n -= 5; }
  if (n >= 4) { out += "IV"; n -= 4; }
  while (n >= 1) { out += "I"; n -= 1; }
  return out;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(1)",
          space: "O(1)",
          why: "Same greedy idea, data-driven: walk a values array and append the matching glyph count times.\nHow it works: values and glyphs are aligned. For each pair, while num >= values[i], append glyphs[i] and subtract.",
          code: `function intToRoman(num) {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let out = "";
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      out += glyphs[i];
      num -= values[i];
    }
  }
  return out;
}`,
          codes: {
            javascript: `function intToRoman(num) {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let out = "";
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      out += glyphs[i];
      num -= values[i];
    }
  }
  return out;
}`,
            python: `def int_to_roman(num):
    values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    out = ""
    for i in range(len(values)):

        while num >= values[i]:
            out += glyphs[i]
            num -= values[i]

    return out`,
            java: `class Solution {
  public String intToRoman(int num) {
    int values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    int glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    String out = "";
    for (int i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        out += glyphs[i];
        num -= values[i];
      }
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
string intToRoman(int num) {
  int values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  int glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  string out = "";
  for (int i = 0; i < (int)values.size(); i++) {
    while (num >= values[i]) {
      out += glyphs[i];
      num -= values[i];
    }
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
void intToRoman(int num, char* out) {
  int values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  int glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  char out[1024]; /* "" */
  for (int i = 0; i < values_len; i++) {
    while (num >= values[i]) {
      out += glyphs[i];
      num -= values[i];
    }
  }
  return out;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(1)",
          space: "O(1)",
          why: "Use division to append a glyph in a batch instead of a per-unit inner while for large counts (e.g. 3 -> \"III\" in one repeat).\nHow it works: count = Math.floor(num / values[i]); append glyphs[i] that many times; num %= values[i].",
          code: `function intToRoman(num) {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let out = "";
  for (let i = 0; i < values.length; i++) {
    const count = Math.floor(num / values[i]);
    for (let c = 0; c < count; c++) out += glyphs[i];
    num %= values[i];
  }
  return out;
}`,
          codes: {
            javascript: `function intToRoman(num) {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  let out = "";
  for (let i = 0; i < values.length; i++) {
    const count = Math.floor(num / values[i]);
    for (let c = 0; c < count; c++) out += glyphs[i];
    num %= values[i];
  }
  return out;
}`,
            python: `def int_to_roman(num):
    values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    out = ""
    for i in range(len(values)):

        count = int(num / values[i])
        for c in range(count):
            out += glyphs[i]
        num %= values[i]

    return out`,
            java: `class Solution {
  public String intToRoman(int num) {
    int values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    int glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    String out = "";
    for (int i = 0; i < values.length; i++) {
      int count = (num / values[i]);
      for (int c = 0; c < count; c++) out += glyphs[i];
      num %= values[i];
    }
    return out;
  }
}`,
            cpp: `// vector, unordered_map, string
string intToRoman(int num) {
  int values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  int glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  string out = "";
  for (int i = 0; i < (int)values.size(); i++) {
    int count = (int)(num / values[i]);
    for (int c = 0; c < count; c++) out += glyphs[i];
    num %= values[i];
  }
  return out;
}`,
            c: `/* pass n for array length; simple loops */
void intToRoman(int num, char* out) {
  int values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  int glyphs = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
  char out[1024]; /* "" */
  for (int i = 0; i < values_len; i++) {
    int count = (num / values[i]);
    for (int c = 0; c < count; c++) out += glyphs[i];
    num %= values[i];
  }
  return out;
}`
          }
        }
      ]
    },
    {
      id: 19,
      level: "intermediate",
      q: "Permutation in String",
      ask: "Microsoft · Amazon · Google · Uber",
      a: "Return true if s2 contains a permutation of s1 as a substring: some window of length s1.length with the same letter counts.\n\nExample: s1 = \"ab\", s2 = \"eidbaooo\" is true (\"ba\"). Example: s1 = \"ab\", s2 = \"eidboaoo\" is false.\n\nGenerating all permutations of s1 is factorial. Sliding a window of width m and comparing 26 counts each step is O(n*26). A matches counter updates in O(1) per step.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(m! · n)",
          space: "O(m! · m)",
          why: "All unique perms of s1 are generated, then each is searched in s2. Factorial in m.\nHow it works: backtracking builds permutations. indexOf each perm in s2; any hit is true.",
          code: `function checkInclusion(s1, s2) {
  const bag = [];
  function permute(arr, from) {
    if (from === arr.length) {
      bag.push(arr.join(""));
      return;
    }
    const used = new Set();
    for (let i = from; i < arr.length; i++) {
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
  permute(s1.split(""), 0);
  for (let i = 0; i < bag.length; i++) {
    if (s2.indexOf(bag[i]) !== -1) return true;
  }
  return false;
}`,
          codes: {
            javascript: `function checkInclusion(s1, s2) {
  const bag = [];
  function permute(arr, from) {
    if (from === arr.length) {
      bag.push(arr.join(""));
      return;
    }
    const used = new Set();
    for (let i = from; i < arr.length; i++) {
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
  permute(s1.split(""), 0);
  for (let i = 0; i < bag.length; i++) {
    if (s2.indexOf(bag[i]) !== -1) return true;
  }
  return false;
}`,
            python: `def check_inclusion(s1, s2):
    bag = []
    def permute(arr, start):
        if start == len(arr):
            bag.append("".join(arr))
            return
        used = set()
        for i in range(start, len(arr)):

            if arr[i] in used: continue
            used.add(arr[i])
            t = arr[start]
            arr[start] = arr[i]
            arr[i] = t
            permute(arr, start + 1)
            arr[i] = arr[start]
            arr[start] = t

    permute(list(s1), 0)
    for i in range(len(bag)):

        if s2.find(bag[i]) if isinstance(s2, str) else (s2.index(bag[i]) if bag[i] in s2 else -1) != -1: return True

    return False`,
            java: `class Solution {
  public boolean checkInclusion(String s1, String s2) {
    List<Integer> bag = new ArrayList<>();
    public void permute(arr, from) {
      if (from == arr.length) {
        bag.add(String.join("", arr));
        return;
      }
      Set<Integer> used = new HashSet<>();
      for (int i = from; i < arr.length; i++) {
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
    permute(s1.split(""), 0);
    for (int i = 0; i < bag.size(); i++) {
      if (s2.indexOf(bag[i]) != -1) return true;
    }
    return false;
  }
}`,
            cpp: `// vector, unordered_map, string
bool checkInclusion(string s1, string s2) {
  vector<int> bag;
  auto permute = [&](arr, from) {
    if (from == (int)arr.size()) {
      bag.push_back(/* join arr */);
      return;
    }
    unordered_set<int> used;
    for (int i = from; i < (int)arr.size(); i++) {
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
  permute(/* split s1 */, 0);
  for (int i = 0; i < (int)bag.size(); i++) {
    if ((int)s2.find(bag[i]) != -1) return true;
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
int checkInclusion(char* s1, char* s2) {
  int bag[1024]; int bag_n = 0;
  void permute(/* arr, from */) {
    if (from == arr_len) {
      /* push */(/* join arr */);
      return;
    }
    int used_keys[1024]; int used_n = 0;
    for (int i = from; i < arr_len; i++) {
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
  permute(/* split s1 */, 0);
  for (int i = 0; i < bag_len; i++) {
    if (/* indexOf */ != -1) return 1;
  }
  return 0;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n · 26)",
          space: "O(1)",
          why: "Window of size m slides across s2. Each position compares two 26-slot arrays.\nHow it works: need counts s1. have counts the current window. If they match, true. Slide by dropping left and adding right.",
          code: `function checkInclusion(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  if (m > n) return false;
  const need = new Array(26).fill(0);
  const have = new Array(26).fill(0);
  for (let i = 0; i < m; i++) {
    need[s1.charCodeAt(i) - 97]++;
    have[s2.charCodeAt(i) - 97]++;
  }
  function same() {
    for (let i = 0; i < 26; i++) if (need[i] !== have[i]) return false;
    return true;
  }
  if (same()) return true;
  for (let right = m; right < n; right++) {
    have[s2.charCodeAt(right) - 97]++;
    have[s2.charCodeAt(right - m) - 97]--;
    if (same()) return true;
  }
  return false;
}`,
          codes: {
            javascript: `function checkInclusion(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  if (m > n) return false;
  const need = new Array(26).fill(0);
  const have = new Array(26).fill(0);
  for (let i = 0; i < m; i++) {
    need[s1.charCodeAt(i) - 97]++;
    have[s2.charCodeAt(i) - 97]++;
  }
  function same() {
    for (let i = 0; i < 26; i++) if (need[i] !== have[i]) return false;
    return true;
  }
  if (same()) return true;
  for (let right = m; right < n; right++) {
    have[s2.charCodeAt(right) - 97]++;
    have[s2.charCodeAt(right - m) - 97]--;
    if (same()) return true;
  }
  return false;
}`,
            python: `def check_inclusion(s1, s2):
    m = len(s1)
    n = len(s2)
    if m > n: return False
    need = [0] * 26
    have = [0] * 26
    for i in range(m):

        need[ord(s1[i]) - 97]++
        have[ord(s2[i]) - 97]++

    def same():
        for i in range(26):
            if need[i] != have[i]: return False
        return True
    if same(): return True
    for right in range(m, n):

        have[ord(s2[right]) - 97]++
        have[ord(s2[right - m]) - 97]--
        if same(): return True

    return False`,
            java: `class Solution {
  public boolean checkInclusion(String s1, String s2) {
    int m = s1.length();
    int n = s2.length();
    if (m > n) return false;
    int[] need = new int[26];
    int[] have = new int[26];
    for (int i = 0; i < m; i++) {
      need[(int)s1.charAt(i) - 97]++;
      have[(int)s2.charAt(i) - 97]++;
    }
    public void same() {
      for (int i = 0; i < 26; i++) if (need[i] != have[i]) return false;
      return true;
    }
    if (same()) return true;
    for (int right = m; right < n; right++) {
      have[(int)s2.charAt(right) - 97]++;
      have[(int)s2.charAt(right - m) - 97]--;
      if (same()) return true;
    }
    return false;
  }
}`,
            cpp: `// vector, unordered_map, string
bool checkInclusion(string s1, string s2) {
  int m = (int)s1.size();
  int n = (int)s2.size();
  if (m > n) return false;
  vector<int> need = vector<int>(26, 0);
  vector<int> have = vector<int>(26, 0);
  for (int i = 0; i < m; i++) {
    need[(int)s1[i] - 97]++;
    have[(int)s2[i] - 97]++;
  }
  auto same = [&]() {
    for (int i = 0; i < 26; i++) if (need[i] != have[i]) return false;
    return true;
  }
  if (same()) return true;
  for (int right = m; right < n; right++) {
    have[(int)s2[right] - 97]++;
    have[(int)s2[right - m] - 97]--;
    if (same()) return true;
  }
  return false;
}`,
            c: `/* pass n for array length; simple loops */
int checkInclusion(char* s1, char* s2) {
  int m = strlen(s1);
  /* n is the given length */
  if (m > n) return 0;
  int need = /* zeros 26 */;
  int have = /* zeros 26 */;
  for (int i = 0; i < m; i++) {
    need[(int)s1[i] - 97]++;
    have[(int)s2[i] - 97]++;
  }
  void same(/*  */) {
    for (int i = 0; i < 26; i++) if (need[i] != have[i]) return 0;
    return 1;
  }
  if (same()) return 1;
  for (int right = m; right < n; right++) {
    have[(int)s2[right] - 97]++;
    have[(int)s2[right - m] - 97]--;
    if (same()) return 1;
  }
  return 0;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "matches tracks how many of the 26 letters currently have the right count. Each add/drop updates matches in O(1).\nHow it works: when have[i] hits need[i], matches++. When it leaves, matches--. matches === 26 (or the number of letters that appear in s1) means the window is a permutation. Here we compare all 26 including zeros, so 26 is the target.",
          code: `function checkInclusion(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  if (m > n) return false;
  const need = new Array(26).fill(0);
  const have = new Array(26).fill(0);
  for (let i = 0; i < m; i++) {
    need[s1.charCodeAt(i) - 97]++;
    have[s2.charCodeAt(i) - 97]++;
  }
  let matches = 0;
  for (let i = 0; i < 26; i++) if (need[i] === have[i]) matches++;
  if (matches === 26) return true;
  for (let right = m; right < n; right++) {
    const add = s2.charCodeAt(right) - 97;
    const drop = s2.charCodeAt(right - m) - 97;
    have[add]++;
    if (have[add] === need[add]) matches++;
    else if (have[add] === need[add] + 1) matches--;
    have[drop]--;
    if (have[drop] === need[drop]) matches++;
    else if (have[drop] === need[drop] - 1) matches--;
    if (matches === 26) return true;
  }
  return false;
}`,
          codes: {
            javascript: `function checkInclusion(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  if (m > n) return false;
  const need = new Array(26).fill(0);
  const have = new Array(26).fill(0);
  for (let i = 0; i < m; i++) {
    need[s1.charCodeAt(i) - 97]++;
    have[s2.charCodeAt(i) - 97]++;
  }
  let matches = 0;
  for (let i = 0; i < 26; i++) if (need[i] === have[i]) matches++;
  if (matches === 26) return true;
  for (let right = m; right < n; right++) {
    const add = s2.charCodeAt(right) - 97;
    const drop = s2.charCodeAt(right - m) - 97;
    have[add]++;
    if (have[add] === need[add]) matches++;
    else if (have[add] === need[add] + 1) matches--;
    have[drop]--;
    if (have[drop] === need[drop]) matches++;
    else if (have[drop] === need[drop] - 1) matches--;
    if (matches === 26) return true;
  }
  return false;
}`,
            python: `def check_inclusion(s1, s2):
    m = len(s1)
    n = len(s2)
    if m > n: return False
    need = [0] * 26
    have = [0] * 26
    for i in range(m):

        need[ord(s1[i]) - 97]++
        have[ord(s2[i]) - 97]++

    matches = 0
    for i in range(26):
        if need[i] == have[i]: matches += 1
    if matches == 26: return True
    for right in range(m, n):

        add = ord(s2[right]) - 97
        drop = ord(s2[right - m]) - 97
        have[add]++
        if have[add] == need[add]: matches += 1
        elif have[add] == need[add] + 1: matches -= 1
        have[drop]--
        if have[drop] == need[drop]: matches += 1
        elif have[drop] == need[drop] - 1: matches -= 1
        if matches == 26: return True

    return False`,
            java: `class Solution {
  public boolean checkInclusion(String s1, String s2) {
    int m = s1.length();
    int n = s2.length();
    if (m > n) return false;
    int[] need = new int[26];
    int[] have = new int[26];
    for (int i = 0; i < m; i++) {
      need[(int)s1.charAt(i) - 97]++;
      have[(int)s2.charAt(i) - 97]++;
    }
    int matches = 0;
    for (int i = 0; i < 26; i++) if (need[i] == have[i]) matches++;
    if (matches == 26) return true;
    for (int right = m; right < n; right++) {
      int add = (int)s2.charAt(right) - 97;
      int drop = (int)s2.charAt(right - m) - 97;
      have[add]++;
      if (have[add] == need[add]) matches++;
      else if (have[add] == need[add] + 1) matches--;
      have[drop]--;
      if (have[drop] == need[drop]) matches++;
      else if (have[drop] == need[drop] - 1) matches--;
      if (matches == 26) return true;
    }
    return false;
  }
}`,
            cpp: `// vector, unordered_map, string
bool checkInclusion(string s1, string s2) {
  int m = (int)s1.size();
  int n = (int)s2.size();
  if (m > n) return false;
  vector<int> need = vector<int>(26, 0);
  vector<int> have = vector<int>(26, 0);
  for (int i = 0; i < m; i++) {
    need[(int)s1[i] - 97]++;
    have[(int)s2[i] - 97]++;
  }
  int matches = 0;
  for (int i = 0; i < 26; i++) if (need[i] == have[i]) matches++;
  if (matches == 26) return true;
  for (int right = m; right < n; right++) {
    int add = (int)s2[right] - 97;
    int drop = (int)s2[right - m] - 97;
    have[add]++;
    if (have[add] == need[add]) matches++;
    else if (have[add] == need[add] + 1) matches--;
    have[drop]--;
    if (have[drop] == need[drop]) matches++;
    else if (have[drop] == need[drop] - 1) matches--;
    if (matches == 26) return true;
  }
  return false;
}`,
            c: `/* pass n for array length; simple loops */
int checkInclusion(char* s1, char* s2) {
  int m = strlen(s1);
  /* n is the given length */
  if (m > n) return 0;
  int need = /* zeros 26 */;
  int have = /* zeros 26 */;
  for (int i = 0; i < m; i++) {
    need[(int)s1[i] - 97]++;
    have[(int)s2[i] - 97]++;
  }
  int matches = 0;
  for (int i = 0; i < 26; i++) if (need[i] == have[i]) matches++;
  if (matches == 26) return 1;
  for (int right = m; right < n; right++) {
    int add = (int)s2[right] - 97;
    int drop = (int)s2[right - m] - 97;
    have[add]++;
    if (have[add] == need[add]) matches++;
    else if (have[add] == need[add] + 1) matches--;
    have[drop]--;
    if (have[drop] == need[drop]) matches++;
    else if (have[drop] == need[drop] - 1) matches--;
    if (matches == 26) return 1;
  }
  return 0;
}`
          }
        }
      ]
    },
    {
      id: 20,
      level: "beginner",
      q: "Longest Palindrome",
      ask: "Amazon · Google · Adobe · Microsoft",
      a: "Given a string of letters, return the length of the longest palindrome you can build by rearranging (and using letters from) s. You do not have to use every character.\n\nExample: \"abccccdd\" -> 7, for example \"dccaccd\".\n\nYou could try arrangements, which is hopeless. A count map plus “use all even parts, at most one odd center” is the idea. A fixed-size array of 128 (or 52) slots drops the hash map.\n\nOpen the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Count with nested scans: for each character type, walk the whole string. Slow counting, same final formula.\nHow it works: collect unique letters. For each letter, count occurrences with a full scan. Add even parts; remember if any odd exists; add 1 for a center.",
          code: `function longestPalindrome(s) {
  const letters = [];
  for (let i = 0; i < s.length; i++) {
    if (letters.indexOf(s[i]) === -1) letters.push(s[i]);
  }
  let len = 0;
  let odd = false;
  for (let L = 0; L < letters.length; L++) {
    let c = 0;
    for (let i = 0; i < s.length; i++) if (s[i] === letters[L]) c++;
    len += c - (c % 2);
    if (c % 2 === 1) odd = true;
  }
  return odd ? len + 1 : len;
}`,
          codes: {
            javascript: `function longestPalindrome(s) {
  const letters = [];
  for (let i = 0; i < s.length; i++) {
    if (letters.indexOf(s[i]) === -1) letters.push(s[i]);
  }
  let len = 0;
  let odd = false;
  for (let L = 0; L < letters.length; L++) {
    let c = 0;
    for (let i = 0; i < s.length; i++) if (s[i] === letters[L]) c++;
    len += c - (c % 2);
    if (c % 2 === 1) odd = true;
  }
  return odd ? len + 1 : len;
}`,
            python: `def longest_palindrome(s):
    letters = []
    for i in range(len(s)):

        if letters.find(s[i]) if isinstance(letters, str) else (letters.index(s[i]) if s[i] in letters else -1) == -1: letters.append(s[i])

    length = 0
    odd = False
    for L in range(len(letters)):

        c = 0
        for i in range(len(s)):
            if s[i] == letters[L]: c += 1
        length += c - (c % 2)
        if c % 2 == 1: odd = True

    length + 1 if return odd else length`,
            java: `class Solution {
  public int longestPalindrome(String s) {
    List<Integer> letters = new ArrayList<>();
    for (int i = 0; i < s.length(); i++) {
      if (letters.indexOf(s.charAt(i)) == -1) letters.add(s.charAt(i));
    }
    int len = 0;
    boolean odd = false;
    for (int L = 0; L < letters.size(); L++) {
      int c = 0;
      for (int i = 0; i < s.length(); i++) if (s.charAt(i) == letters[L]) c++;
      len += c - (c % 2);
      if (c % 2 == 1) odd = true;
    }
    return odd ? len + 1 : len;
  }
}`,
            cpp: `// vector, unordered_map, string
int longestPalindrome(string s) {
  vector<int> letters;
  for (int i = 0; i < (int)s.size(); i++) {
    if ((int)letters.find(s[i]) == -1) letters.push_back(s[i]);
  }
  int len = 0;
  bool odd = false;
  for (int L = 0; L < (int)letters.size(); L++) {
    int c = 0;
    for (int i = 0; i < (int)s.size(); i++) if (s[i] == letters[L]) c++;
    len += c - (c % 2);
    if (c % 2 == 1) odd = true;
  }
  return odd ? len + 1 : len;
}`,
            c: `/* pass n for array length; simple loops */
int longestPalindrome(char* s) {
  int letters[1024]; int letters_n = 0;
  for (int i = 0; i < strlen(s); i++) {
    if (/* indexOf */ == -1) /* push */(s[i]);
  }
  int len = 0;
  int odd = 0;
  for (int L = 0; L < letters_len; L++) {
    int c = 0;
    for (int i = 0; i < strlen(s); i++) if (s[i] == letters[L]) c++;
    len += c - (c % 2);
    if (c % 2 == 1) odd = 1;
  }
  return odd ? len + 1 : len;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(k)",
          why: "One pass to count, one pass over unique keys. k is the alphabet size.\nHow it works: object/map frequencies. Even contribution is count - count%2. One leftover odd becomes the center.",
          code: `function longestPalindrome(s) {
  const count = {};
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    count[ch] = (count[ch] || 0) + 1;
  }
  let len = 0;
  let odd = false;
  for (const ch in count) {
    len += count[ch] - (count[ch] % 2);
    if (count[ch] % 2 === 1) odd = true;
  }
  return odd ? len + 1 : len;
}`,
          codes: {
            javascript: `function longestPalindrome(s) {
  const count = {};
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    count[ch] = (count[ch] || 0) + 1;
  }
  let len = 0;
  let odd = false;
  for (const ch in count) {
    len += count[ch] - (count[ch] % 2);
    if (count[ch] % 2 === 1) odd = true;
  }
  return odd ? len + 1 : len;
}`,
            python: `def longest_palindrome(s):
    count = {}
    for i in range(len(s)):

        ch = s[i]
        count[ch] = (count[ch] or 0) + 1

    length = 0
    odd = False
    for ch in count:
        length += count[ch] - (count[ch] % 2)
        if count[ch] % 2 == 1: odd = True
    length + 1 if return odd else length`,
            java: `class Solution {
  public int longestPalindrome(String s) {
    int count = {};
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i);
      count[ch] = (count[ch] || 0) + 1;
    }
    int len = 0;
    boolean odd = false;
    for (var ch : count) {
      len += count[ch] - (count[ch] % 2);
      if (count[ch] % 2 == 1) odd = true;
    }
    return odd ? len + 1 : len;
  }
}`,
            cpp: `// vector, unordered_map, string
int longestPalindrome(string s) {
  unordered_map<int,int> count;
  for (int i = 0; i < (int)s.size(); i++) {
    char ch = s[i];
    count[ch] = (count[ch] || 0) + 1;
  }
  int len = 0;
  bool odd = false;
  for (auto ch : count) {
    len += count[ch] - (count[ch] % 2);
    if (count[ch] % 2 == 1) odd = true;
  }
  return odd ? len + 1 : len;
}`,
            c: `/* pass n for array length; simple loops */
int longestPalindrome(char* s) {
  int count = {};
  for (int i = 0; i < strlen(s); i++) {
    int ch = s[i];
    count[ch] = (count[ch] || 0) + 1;
  }
  int len = 0;
  int odd = 0;
  for (auto ch : count) {
    len += count[ch] - (count[ch] % 2);
    if (count[ch] % 2 == 1) odd = 1;
  }
  return odd ? len + 1 : len;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "128 slots cover ASCII letters used in the usual prompt. Extra memory is constant.\nHow it works: count[charCode]++. Same even/odd rule on the 128 numbers. Equivalent: len += count[i] & ~1, then if len < s.length add 1.",
          code: `function longestPalindrome(s) {
  const count = new Array(128).fill(0);
  for (let i = 0; i < s.length; i++) count[s.charCodeAt(i)]++;
  let len = 0;
  for (let i = 0; i < 128; i++) len += count[i] - (count[i] % 2);
  if (len < s.length) len += 1;
  return len;
}`,
          codes: {
            javascript: `function longestPalindrome(s) {
  const count = new Array(128).fill(0);
  for (let i = 0; i < s.length; i++) count[s.charCodeAt(i)]++;
  let len = 0;
  for (let i = 0; i < 128; i++) len += count[i] - (count[i] % 2);
  if (len < s.length) len += 1;
  return len;
}`,
            python: `def longest_palindrome(s):
    count = [0] * 128
    for i in range(len(s)):
        count[ord(s[i])]++
    length = 0
    for i in range(128):
        length += count[i] - (count[i] % 2)
    if length < len(s): length += 1
    return length`,
            java: `class Solution {
  public int longestPalindrome(String s) {
    int[] count = new int[128];
    for (int i = 0; i < s.length(); i++) count[(int)s.charAt(i)]++;
    int len = 0;
    for (int i = 0; i < 128; i++) len += count[i] - (count[i] % 2);
    if (len < s.length()) len += 1;
    return len;
  }
}`,
            cpp: `// vector, unordered_map, string
int longestPalindrome(string s) {
  vector<int> count = vector<int>(128, 0);
  for (int i = 0; i < (int)s.size(); i++) count[(int)s[i]]++;
  int len = 0;
  for (int i = 0; i < 128; i++) len += count[i] - (count[i] % 2);
  if (len < (int)s.size()) len += 1;
  return len;
}`,
            c: `/* pass n for array length; simple loops */
int longestPalindrome(char* s) {
  int count = /* zeros 128 */;
  for (int i = 0; i < strlen(s); i++) count[(int)s[i]]++;
  int len = 0;
  for (int i = 0; i < 128; i++) len += count[i] - (count[i] % 2);
  if (len < strlen(s)) len += 1;
  return len;
}`
          }
        }
      ]
    }
  ]
};
