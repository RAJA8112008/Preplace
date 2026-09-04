module.exports = [
  {
    python: `def ladderLength(beginWord, endWord, wordList):
  words = set(wordList)
  if endWord not in words: return 0
  best = float("inf")
  def dfs(word, dist, left):
    nonlocal best
    if dist >= best: return
    if word == endWord:
      best = dist
      return
    for i in range(len(word)):
      for c in range(97, 123):
        nxt = word[:i] + chr(c) + word[i+1:]
        if nxt not in left: continue
        copy = set(left)
        copy.discard(nxt)
        dfs(nxt, dist+1, copy)
  dfs(beginWord, 1, words)
  return 0 if best == float("inf") else best`,
    java: `import java.util.*;
class Solution {
  int best;
  void dfs(String word, int dist, Set<String> left, String endWord) {
    if (dist >= best) return;
    if (word.equals(endWord)) { best = dist; return; }
    char[] arr = word.toCharArray();
    for (int i = 0; i < arr.length; i++) {
      char old = arr[i];
      for (char c = 'a'; c <= 'z'; c++) {
        arr[i] = c;
        String next = new String(arr);
        if (!left.contains(next)) continue;
        Set<String> copy = new HashSet<String>(left);
        copy.remove(next);
        dfs(next, dist+1, copy, endWord);
      }
      arr[i] = old;
    }
  }
  public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> words = new HashSet<String>(wordList);
    if (!words.contains(endWord)) return 0;
    best = Integer.MAX_VALUE;
    dfs(beginWord, 1, words, endWord);
    return best == Integer.MAX_VALUE ? 0 : best;
  }
}`,
    cpp: `class Solution {
  int best;
  void dfs(string word, int dist, unordered_set<string> left, string endWord) {
    if (dist >= best) return;
    if (word == endWord) { best = dist; return; }
    for (int i = 0; i < (int)word.size(); i++) {
      char old = word[i];
      for (char c = 'a'; c <= 'z'; c++) {
        word[i] = c;
        if (!left.count(word)) continue;
        auto copy = left; copy.erase(word);
        dfs(word, dist+1, copy, endWord);
      }
      word[i] = old;
    }
  }
public:
  int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> words(wordList.begin(), wordList.end());
    if (!words.count(endWord)) return 0;
    best = INT_MAX;
    dfs(beginWord, 1, words, endWord);
    return best == INT_MAX ? 0 : best;
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
#include <limits.h>
int best_ll;
int has_word(char** left, int n, int* used, const char* w) {
  for (int i=0;i<n;i++) if (!used[i] && !strcmp(left[i], w)) return i;
  return -1;
}
void dfs_ll(char* word, int dist, char** left, int n, int* used, const char* endWord) {
  if (dist >= best_ll) return;
  if (!strcmp(word, endWord)) { best_ll = dist; return; }
  int L = (int)strlen(word);
  char* next = (char*)malloc(L+1); strcpy(next, word);
  for (int i=0;i<L;i++) {
    char old = next[i];
    for (char c='a'; c<='z'; c++) {
      next[i]=c;
      int idx = has_word(left, n, used, next);
      if (idx < 0) continue;
      int* copy=(int*)malloc(sizeof(int)*n); memcpy(copy, used, sizeof(int)*n); copy[idx]=1;
      dfs_ll(next, dist+1, left, n, copy, endWord);
      free(copy);
    }
    next[i]=old;
  }
  free(next);
}
int ladderLength(char* beginWord, char* endWord, char** wordList, int n) {
  int found=0; for (int i=0;i<n;i++) if (!strcmp(wordList[i], endWord)) found=1;
  if (!found) return 0;
  best_ll = INT_MAX;
  int* used=(int*)calloc(n,sizeof(int));
  dfs_ll(beginWord, 1, wordList, n, used, endWord);
  return best_ll==INT_MAX ? 0 : best_ll;
}`
  },
  {
    python: `from collections import deque
def ladderLength(beginWord, endWord, wordList):
  words = set(wordList)
  if endWord not in words: return 0
  q = deque([(beginWord, 1)])
  words.discard(beginWord)
  while q:
    word, dist = q.popleft()
    if word == endWord: return dist
    for i in range(len(word)):
      for c in range(97, 123):
        nxt = word[:i] + chr(c) + word[i+1:]
        if nxt not in words: continue
        words.discard(nxt)
        q.append((nxt, dist+1))
  return 0`,
    java: `import java.util.*;
class Solution {
  public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> words = new HashSet<String>(wordList);
    if (!words.contains(endWord)) return 0;
    ArrayDeque<String> q = new ArrayDeque<String>();
    ArrayDeque<Integer> d = new ArrayDeque<Integer>();
    q.addLast(beginWord); d.addLast(1);
    words.remove(beginWord);
    while (!q.isEmpty()) {
      String word = q.pollFirst(); int dist = d.pollFirst();
      if (word.equals(endWord)) return dist;
      char[] arr = word.toCharArray();
      for (int i = 0; i < arr.length; i++) {
        char old = arr[i];
        for (char c = 'a'; c <= 'z'; c++) {
          arr[i] = c;
          String next = new String(arr);
          if (!words.contains(next)) continue;
          words.remove(next);
          q.addLast(next); d.addLast(dist+1);
        }
        arr[i] = old;
      }
    }
    return 0;
  }
}`,
    cpp: `class Solution {
public:
  int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> words(wordList.begin(), wordList.end());
    if (!words.count(endWord)) return 0;
    queue<pair<string,int>> q;
    q.push({beginWord, 1});
    words.erase(beginWord);
    while (!q.empty()) {
      auto cur = q.front(); q.pop();
      string word = cur.first; int dist = cur.second;
      if (word == endWord) return dist;
      for (int i = 0; i < (int)word.size(); i++) {
        char old = word[i];
        for (char c = 'a'; c <= 'z'; c++) {
          word[i] = c;
          if (!words.count(word)) continue;
          words.erase(word);
          q.push({word, dist+1});
        }
        word[i] = old;
      }
    }
    return 0;
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
int in_set(char** w, int n, int* used, const char* s) {
  for (int i=0;i<n;i++) if (!used[i] && !strcmp(w[i], s)) return i;
  return -1;
}
int ladderLength(char* beginWord, char* endWord, char** wordList, int n) {
  int found=0; for (int i=0;i<n;i++) if (!strcmp(wordList[i], endWord)) found=1;
  if (!found) return 0;
  int* used=(int*)calloc(n,sizeof(int));
  int bi=in_set(wordList,n,used,beginWord); if (bi>=0) used[bi]=1;
  int cap=n+2; char** q=(char**)malloc(sizeof(char*)*cap); int* dist=(int*)malloc(sizeof(int)*cap);
  int h=0,t=0; q[t]=beginWord; dist[t]=1; t++;
  int L=(int)strlen(beginWord);
  while (h<t) {
    char* word=q[h]; int d=dist[h]; h++;
    if (!strcmp(word, endWord)) return d;
    char* next=(char*)malloc(L+1); strcpy(next, word);
    for (int i=0;i<L;i++) {
      char old=next[i];
      for (char c='a';c<='z';c++) {
        next[i]=c;
        int idx=in_set(wordList,n,used,next);
        if (idx<0) continue;
        used[idx]=1;
        q[t]=wordList[idx]; dist[t]=d+1; t++;
      }
      next[i]=old;
    }
    free(next);
  }
  return 0;
}`
  },
  {
    python: `def ladderLength(beginWord, endWord, wordList):
  words = set(wordList)
  if endWord not in words: return 0
  begin = {beginWord}
  end = {endWord}
  seen = {beginWord, endWord}
  steps = 1
  while begin and end:
    if len(begin) > len(end):
      begin, end = end, begin
    nxt = set()
    for word in list(begin):
      for i in range(len(word)):
        for c in range(97, 123):
          cand = word[:i] + chr(c) + word[i+1:]
          if cand in end: return steps + 1
          if cand not in words or cand in seen: continue
          seen.add(cand)
          nxt.add(cand)
    begin = nxt
    steps += 1
  return 0`,
    java: `import java.util.*;
class Solution {
  public int ladderLength(String beginWord, String endWord, List<String> wordList) {
    Set<String> words = new HashSet<String>(wordList);
    if (!words.contains(endWord)) return 0;
    Set<String> begin = new HashSet<String>(), end = new HashSet<String>(), seen = new HashSet<String>();
    begin.add(beginWord); end.add(endWord); seen.add(beginWord); seen.add(endWord);
    int steps = 1;
    while (!begin.isEmpty() && !end.isEmpty()) {
      if (begin.size() > end.size()) { Set<String> tmp=begin; begin=end; end=tmp; }
      Set<String> next = new HashSet<String>();
      for (String word : begin) {
        char[] arr = word.toCharArray();
        for (int i = 0; i < arr.length; i++) {
          char old = arr[i];
          for (char c = 'a'; c <= 'z'; c++) {
            arr[i] = c;
            String cand = new String(arr);
            if (end.contains(cand)) return steps + 1;
            if (!words.contains(cand) || seen.contains(cand)) continue;
            seen.add(cand); next.add(cand);
          }
          arr[i] = old;
        }
      }
      begin = next; steps++;
    }
    return 0;
  }
}`,
    cpp: `class Solution {
public:
  int ladderLength(string beginWord, string endWord, vector<string>& wordList) {
    unordered_set<string> words(wordList.begin(), wordList.end());
    if (!words.count(endWord)) return 0;
    unordered_set<string> begin{beginWord}, end{endWord}, seen{beginWord, endWord};
    int steps = 1;
    while (!begin.empty() && !end.empty()) {
      if (begin.size() > end.size()) swap(begin, end);
      unordered_set<string> next;
      for (string word : begin) {
        for (int i = 0; i < (int)word.size(); i++) {
          char old = word[i];
          for (char c = 'a'; c <= 'z'; c++) {
            word[i] = c;
            if (end.count(word)) return steps + 1;
            if (!words.count(word) || seen.count(word)) continue;
            seen.insert(word); next.insert(word);
          }
          word[i] = old;
        }
      }
      begin.swap(next); steps++;
    }
    return 0;
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
/* bidirectional BFS: two frontier arrays of word indices; words[n] plus begin as extra */
int ladderLength(char* beginWord, char* endWord, char** wordList, int n) {
  int endIdx=-1;
  for (int i=0;i<n;i++) if (!strcmp(wordList[i], endWord)) endIdx=i;
  if (endIdx<0) return 0;
  int* seen=(int*)calloc(n+1,sizeof(int));
  int* b1=(int*)malloc(sizeof(int)*(n+1));
  int* b2=(int*)malloc(sizeof(int)*(n+1));
  int n1=1, n2=1; b1[0]=-1; /* -1 means beginWord */ b2[0]=endIdx;
  seen[endIdx]=1;
  int steps=1;
  while (n1 && n2) {
    if (n1>n2) { int* t=b1; b1=b2; b2=t; int tn=n1; n1=n2; n2=tn; }
    int nn=0; int* next=(int*)malloc(sizeof(int)*(n+1));
    for (int b=0;b<n1;b++) {
      char* word = b1[b]<0 ? beginWord : wordList[b1[b]];
      int L=(int)strlen(word);
      char* cand=(char*)malloc(L+1); strcpy(cand, word);
      for (int i=0;i<L;i++) {
        char old=cand[i];
        for (char c='a';c<='z';c++) {
          cand[i]=c;
          int inEnd=0;
          for (int k=0;k<n2;k++) {
            char* ew = b2[k]<0 ? beginWord : wordList[b2[k]];
            if (!strcmp(cand, ew)) { free(cand); return steps+1; }
          }
          int idx=-1;
          for (int j=0;j<n;j++) if (!seen[j] && !strcmp(wordList[j], cand)) { idx=j; break; }
          if (idx<0) continue;
          seen[idx]=1; next[nn++]=idx;
        }
        cand[i]=old;
      }
      free(cand);
    }
    free(b1); b1=next; n1=nn; steps++;
  }
  return 0;
}`
  }
];
