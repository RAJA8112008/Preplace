module.exports = [
  // 48 car fleet brute
  {
    python: `def carFleet(target, position, speed):
  n = len(position)
  cars = [{"p": position[i], "t": (target - position[i]) / speed[i]} for i in range(n)]
  cars.sort(key=lambda c: -c["p"])
  used = [False] * n
  fleets = 0
  for i in range(n):
    if used[i]: continue
    fleets += 1
    for j in range(i + 1, n):
      if cars[j]["t"] <= cars[i]["t"]:
        used[j] = True
  return fleets`,
    java: `import java.util.*;
class Solution {
  public int carFleet(int target, int[] position, int[] speed) {
    int n = position.length;
    double[][] cars = new double[n][2];
    for (int i = 0; i < n; i++) {
      cars[i][0] = position[i];
      cars[i][1] = (target - position[i]) * 1.0 / speed[i];
    }
    Arrays.sort(cars, (a, b) -> Double.compare(b[0], a[0]));
    boolean[] used = new boolean[n];
    int fleets = 0;
    for (int i = 0; i < n; i++) {
      if (used[i]) continue;
      fleets++;
      for (int j = i + 1; j < n; j++) if (cars[j][1] <= cars[i][1]) used[j] = true;
    }
    return fleets;
  }
}`,
    cpp: `class Solution {
public:
  int carFleet(int target, vector<int>& position, vector<int>& speed) {
    int n = (int)position.size();
    vector<pair<double,double>> cars(n);
    for (int i = 0; i < n; i++) cars[i] = { (double)position[i], (target - position[i]) * 1.0 / speed[i] };
    sort(cars.begin(), cars.end(), [](auto& a, auto& b){ return a.first > b.first; });
    vector<int> used(n, 0);
    int fleets = 0;
    for (int i = 0; i < n; i++) {
      if (used[i]) continue;
      fleets++;
      for (int j = i + 1; j < n; j++) if (cars[j].second <= cars[i].second) used[j] = 1;
    }
    return fleets;
  }
};`,
    c: `#include <stdlib.h>
typedef struct { double p, t; } Car;
int cmp_p_desc(const void* a, const void* b) {
  double d = ((const Car*)b)->p - ((const Car*)a)->p;
  return d > 0 ? 1 : d < 0 ? -1 : 0;
}
int carFleet(int target, int* position, int n, int* speed) {
  Car* cars = (Car*)malloc(sizeof(Car)*n);
  for (int i = 0; i < n; i++) { cars[i].p = position[i]; cars[i].t = (target - position[i]) * 1.0 / speed[i]; }
  qsort(cars, n, sizeof(Car), cmp_p_desc);
  int* used = (int*)calloc(n, sizeof(int));
  int fleets = 0;
  for (int i = 0; i < n; i++) {
    if (used[i]) continue;
    fleets++;
    for (int j = i + 1; j < n; j++) if (cars[j].t <= cars[i].t) used[j] = 1;
  }
  free(cars); free(used);
  return fleets;
}`
  },
  // 49 car fleet stack
  {
    python: `def carFleet(target, position, speed):
  n = len(position)
  cars = [[position[i], speed[i]] for i in range(n)]
  cars.sort(key=lambda c: c[0])
  st = []
  for i in range(n - 1, -1, -1):
    time = (target - cars[i][0]) / cars[i][1]
    if not st or time > st[-1]:
      st.append(time)
  return len(st)`,
    java: `import java.util.*;
class Solution {
  public int carFleet(int target, int[] position, int[] speed) {
    int n = position.length;
    int[][] cars = new int[n][2];
    for (int i = 0; i < n; i++) { cars[i][0] = position[i]; cars[i][1] = speed[i]; }
    Arrays.sort(cars, (a, b) -> a[0] - b[0]);
    ArrayDeque<Double> st = new ArrayDeque<Double>();
    for (int i = n - 1; i >= 0; i--) {
      double time = (target - cars[i][0]) * 1.0 / cars[i][1];
      if (st.isEmpty() || time > st.peek()) st.push(time);
    }
    return st.size();
  }
}`,
    cpp: `class Solution {
public:
  int carFleet(int target, vector<int>& position, vector<int>& speed) {
    int n = (int)position.size();
    vector<pair<int,int>> cars(n);
    for (int i = 0; i < n; i++) cars[i] = {position[i], speed[i]};
    sort(cars.begin(), cars.end());
    vector<double> st;
    for (int i = n - 1; i >= 0; i--) {
      double time = (target - cars[i].first) * 1.0 / cars[i].second;
      if (st.empty() || time > st.back()) st.push_back(time);
    }
    return (int)st.size();
  }
};`,
    c: `#include <stdlib.h>
typedef struct { int p, s; } Car;
int cmp_p_asc(const void* a, const void* b) { return ((const Car*)a)->p - ((const Car*)b)->p; }
int carFleet(int target, int* position, int n, int* speed) {
  Car* cars = (Car*)malloc(sizeof(Car)*n);
  for (int i = 0; i < n; i++) { cars[i].p = position[i]; cars[i].s = speed[i]; }
  qsort(cars, n, sizeof(Car), cmp_p_asc);
  double* st = (double*)malloc(sizeof(double)*n);
  int sn = 0;
  for (int i = n - 1; i >= 0; i--) {
    double time = (target - cars[i].p) * 1.0 / cars[i].s;
    if (!sn || time > st[sn-1]) st[sn++] = time;
  }
  free(cars); free(st);
  return sn;
}`
  },
  // 50 car fleet reverse scan
  {
    python: `def carFleet(target, position, speed):
  n = len(position)
  cars = [{"p": position[i], "t": (target - position[i]) / speed[i]} for i in range(n)]
  cars.sort(key=lambda c: c["p"])
  fleets = 0
  cur = 0
  for i in range(n - 1, -1, -1):
    if cars[i]["t"] > cur:
      fleets += 1
      cur = cars[i]["t"]
  return fleets`,
    java: `import java.util.*;
class Solution {
  public int carFleet(int target, int[] position, int[] speed) {
    int n = position.length;
    double[][] cars = new double[n][2];
    for (int i = 0; i < n; i++) {
      cars[i][0] = position[i];
      cars[i][1] = (target - position[i]) * 1.0 / speed[i];
    }
    Arrays.sort(cars, (a, b) -> Double.compare(a[0], b[0]));
    int fleets = 0;
    double cur = 0;
    for (int i = n - 1; i >= 0; i--) {
      if (cars[i][1] > cur) { fleets++; cur = cars[i][1]; }
    }
    return fleets;
  }
}`,
    cpp: `class Solution {
public:
  int carFleet(int target, vector<int>& position, vector<int>& speed) {
    int n = (int)position.size();
    vector<pair<double,double>> cars(n);
    for (int i = 0; i < n; i++) cars[i] = { (double)position[i], (target - position[i]) * 1.0 / speed[i] };
    sort(cars.begin(), cars.end());
    int fleets = 0;
    double cur = 0;
    for (int i = n - 1; i >= 0; i--) {
      if (cars[i].second > cur) { fleets++; cur = cars[i].second; }
    }
    return fleets;
  }
};`,
    c: `#include <stdlib.h>
typedef struct { double p, t; } Car;
int cmp_p_asc2(const void* a, const void* b) {
  double d = ((const Car*)a)->p - ((const Car*)b)->p;
  return d > 0 ? 1 : d < 0 ? -1 : 0;
}
int carFleet(int target, int* position, int n, int* speed) {
  Car* cars = (Car*)malloc(sizeof(Car)*n);
  for (int i = 0; i < n; i++) { cars[i].p = position[i]; cars[i].t = (target - position[i]) * 1.0 / speed[i]; }
  qsort(cars, n, sizeof(Car), cmp_p_asc2);
  int fleets = 0;
  double cur = 0;
  for (int i = n - 1; i >= 0; i--) {
    if (cars[i].t > cur) { fleets++; cur = cars[i].t; }
  }
  free(cars);
  return fleets;
}`
  },
  // 51 decode brute recurse
  {
    python: `def decodeString(s):
  def parse(i):
    out = ""
    while i < len(s) and s[i] != "]":
      if s[i] < "0" or s[i] > "9":
        out += s[i]
        i += 1
        continue
      k = 0
      while s[i] >= "0" and s[i] <= "9":
        k = k * 10 + int(s[i])
        i += 1
      i += 1  # skip '['
      inner = parse(i)
      out += inner["text"] * k
      i = inner["i"] + 1  # skip ']'
    return {"text": out, "i": i}
  return parse(0)["text"]`,
    java: `class Solution {
  static class Pair { String text; int i; Pair(String t, int i) { text = t; this.i = i; } }
  Pair parse(String s, int i) {
    StringBuilder out = new StringBuilder();
    while (i < s.length() && s.charAt(i) != ']') {
      if (s.charAt(i) < '0' || s.charAt(i) > '9') {
        out.append(s.charAt(i)); i++; continue;
      }
      int k = 0;
      while (s.charAt(i) >= '0' && s.charAt(i) <= '9') { k = k * 10 + (s.charAt(i) - '0'); i++; }
      i++; // skip '['
      Pair inner = parse(s, i);
      for (int t = 0; t < k; t++) out.append(inner.text);
      i = inner.i + 1; // skip ']'
    }
    return new Pair(out.toString(), i);
  }
  public String decodeString(String s) { return parse(s, 0).text; }
}`,
    cpp: `class Solution {
  pair<string,int> parse(const string& s, int i) {
    string out;
    while (i < (int)s.size() && s[i] != ']') {
      if (s[i] < '0' || s[i] > '9') { out += s[i]; i++; continue; }
      int k = 0;
      while (s[i] >= '0' && s[i] <= '9') { k = k * 10 + (s[i] - '0'); i++; }
      i++; // skip '['
      auto inner = parse(s, i);
      for (int t = 0; t < k; t++) out += inner.first;
      i = inner.second + 1; // skip ']'
    }
    return {out, i};
  }
public:
  string decodeString(string s) { return parse(s, 0).first; }
};`,
    c: `#include <stdlib.h>
#include <string.h>
typedef struct { char* text; int i; } Pair;
Pair parse(const char* s, int i) {
  int cap = 32, n = 0;
  char* out = (char*)malloc(cap); out[0] = 0;
  while (s[i] && s[i] != ']') {
    if (s[i] < '0' || s[i] > '9') {
      if (n + 2 > cap) { cap *= 2; out = (char*)realloc(out, cap); }
      out[n++] = s[i]; out[n] = 0; i++; continue;
    }
    int k = 0;
    while (s[i] >= '0' && s[i] <= '9') { k = k * 10 + (s[i] - '0'); i++; }
    i++; /* skip '[' */
    Pair inner = parse(s, i);
    int inlen = (int)strlen(inner.text);
    for (int t = 0; t < k; t++) {
      if (n + inlen + 1 > cap) { cap = (n + inlen + 1) * 2; out = (char*)realloc(out, cap); }
      memcpy(out + n, inner.text, inlen); n += inlen; out[n] = 0;
    }
    i = inner.i + 1; /* skip ']' */
    free(inner.text);
  }
  Pair p; p.text = out; p.i = i; return p;
}
char* decodeString(const char* s) { return parse(s, 0).text; }`
  },
  // 52 decode one stack
  {
    python: `def decodeString(s):
  st = []
  cur = ""
  k = 0
  for ch in s:
    if "0" <= ch <= "9":
      k = k * 10 + ord(ch) - 48
    elif ch == "[":
      st.append((cur, k))
      cur = ""
      k = 0
    elif ch == "]":
      prev, ck = st.pop()
      cur = prev + cur * ck
    else:
      cur += ch
  return cur`,
    java: `import java.util.*;
class Solution {
  public String decodeString(String s) {
    ArrayDeque<String> strs = new ArrayDeque<String>();
    ArrayDeque<Integer> ks = new ArrayDeque<Integer>();
    StringBuilder cur = new StringBuilder();
    int k = 0;
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i);
      if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
      else if (ch == '[') {
        strs.push(cur.toString()); ks.push(k);
        cur = new StringBuilder(); k = 0;
      } else if (ch == ']') {
        String prev = strs.pop(); int ck = ks.pop();
        StringBuilder next = new StringBuilder(prev);
        for (int t = 0; t < ck; t++) next.append(cur);
        cur = next;
      } else cur.append(ch);
    }
    return cur.toString();
  }
}`,
    cpp: `class Solution {
public:
  string decodeString(string s) {
    vector<pair<string,int>> st;
    string cur; int k = 0;
    for (char ch : s) {
      if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
      else if (ch == '[') { st.push_back({cur, k}); cur = ""; k = 0; }
      else if (ch == ']') {
        auto frame = st.back(); st.pop_back();
        string next = frame.first;
        for (int t = 0; t < frame.second; t++) next += cur;
        cur = next;
      } else cur += ch;
    }
    return cur;
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
char* decodeString(const char* s) {
  char* prevs[128]; int ks[128], sn = 0;
  int cap = 64, n = 0;
  char* cur = (char*)malloc(cap); cur[0] = 0;
  int k = 0;
  for (int i = 0; s[i]; i++) {
    char ch = s[i];
    if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
    else if (ch == '[') {
      prevs[sn] = cur; ks[sn] = k; sn++;
      cap = 64; n = 0; cur = (char*)malloc(cap); cur[0] = 0; k = 0;
    } else if (ch == ']') {
      char* prev = prevs[--sn]; int ck = ks[sn];
      int pn = (int)strlen(prev), cn = (int)strlen(cur);
      char* next = (char*)malloc(pn + cn * ck + 1);
      memcpy(next, prev, pn);
      for (int t = 0; t < ck; t++) memcpy(next + pn + t * cn, cur, cn);
      next[pn + cn * ck] = 0;
      free(prev); free(cur); cur = next;
    } else {
      int cn = (int)strlen(cur);
      cur = (char*)realloc(cur, cn + 2);
      cur[cn] = ch; cur[cn+1] = 0;
    }
  }
  return cur;
}`
  },
  // 53 decode two stacks
  {
    python: `def decodeString(s):
  counts = []
  strs = []
  cur = ""
  k = 0
  for ch in s:
    if "0" <= ch <= "9":
      k = k * 10 + ord(ch) - 48
    elif ch == "[":
      counts.append(k)
      strs.append(cur)
      cur = ""
      k = 0
    elif ch == "]":
      cur = strs.pop() + cur * counts.pop()
    else:
      cur += ch
  return cur`,
    java: `import java.util.*;
class Solution {
  public String decodeString(String s) {
    ArrayDeque<Integer> counts = new ArrayDeque<Integer>();
    ArrayDeque<String> strs = new ArrayDeque<String>();
    StringBuilder cur = new StringBuilder();
    int k = 0;
    for (int i = 0; i < s.length(); i++) {
      char ch = s.charAt(i);
      if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
      else if (ch == '[') {
        counts.push(k); strs.push(cur.toString());
        cur = new StringBuilder(); k = 0;
      } else if (ch == ']') {
        StringBuilder next = new StringBuilder(strs.pop());
        int ck = counts.pop();
        for (int t = 0; t < ck; t++) next.append(cur);
        cur = next;
      } else cur.append(ch);
    }
    return cur.toString();
  }
}`,
    cpp: `class Solution {
public:
  string decodeString(string s) {
    vector<int> counts;
    vector<string> strs;
    string cur; int k = 0;
    for (char ch : s) {
      if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
      else if (ch == '[') { counts.push_back(k); strs.push_back(cur); cur = ""; k = 0; }
      else if (ch == ']') {
        int ck = counts.back(); counts.pop_back();
        string prev = strs.back(); strs.pop_back();
        for (int t = 0; t < ck; t++) prev += cur;
        cur = prev;
      } else cur += ch;
    }
    return cur;
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
char* decodeString(const char* s) {
  char* strs[128]; int counts[128], sn = 0, cn = 0;
  int cap = 64;
  char* cur = (char*)malloc(cap); cur[0] = 0;
  int k = 0;
  for (int i = 0; s[i]; i++) {
    char ch = s[i];
    if (ch >= '0' && ch <= '9') k = k * 10 + (ch - '0');
    else if (ch == '[') {
      counts[cn++] = k; strs[sn++] = cur;
      cap = 64; cur = (char*)malloc(cap); cur[0] = 0; k = 0;
    } else if (ch == ']') {
      int ck = counts[--cn];
      char* prev = strs[--sn];
      int pn = (int)strlen(prev), cl = (int)strlen(cur);
      char* next = (char*)malloc(pn + cl * ck + 1);
      memcpy(next, prev, pn);
      for (int t = 0; t < ck; t++) memcpy(next + pn + t * cl, cur, cl);
      next[pn + cl * ck] = 0;
      free(prev); free(cur); cur = next;
    } else {
      int cl = (int)strlen(cur);
      cur = (char*)realloc(cur, cl + 2);
      cur[cl] = ch; cur[cl+1] = 0;
    }
  }
  return cur;
}`
  }
];
