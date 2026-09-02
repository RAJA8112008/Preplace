module.exports = [
  {
    python: `def alienOrder(words):
  letters = []
  seen = {}
  for w in words:
    for ch in w:
      if ch not in seen:
        seen[ch]=True; letters.append(ch)
  def valid(order):
    rank = {ch:i for i,ch in enumerate(order)}
    for i in range(len(words)-1):
      a, b = words[i], words[i+1]
      n = min(len(a), len(b))
      diff = False
      for j in range(n):
        if a[j]!=b[j]:
          if rank[a[j]] > rank[b[j]]: return False
          diff=True; break
      if not diff and len(a)>len(b): return False
    return True
  ans = ""
  def dfs(used, path):
    nonlocal ans
    if ans: return
    if len(path)==len(letters):
      s="".join(path)
      if valid(s): ans=s
      return
    for i in range(len(letters)):
      if used[i]: continue
      used[i]=True; path.append(letters[i]); dfs(used, path); path.pop(); used[i]=False
  dfs([False]*len(letters), [])
  return ans`,
    java: `import java.util.*;
class Solution {
  String ans;
  boolean valid(String order, String[] words) {
    int[] rank=new int[128];
    for (int i=0;i<order.length();i++) rank[order.charAt(i)]=i;
    for (int i=0;i<words.length-1;i++) {
      String a=words[i], b=words[i+1];
      int n=Math.min(a.length(), b.length());
      boolean diff=false;
      for (int j=0;j<n;j++) if (a.charAt(j)!=b.charAt(j)) {
        if (rank[a.charAt(j)]>rank[b.charAt(j)]) return false;
        diff=true; break;
      }
      if (!diff && a.length()>b.length()) return false;
    }
    return true;
  }
  void dfs(char[] letters, boolean[] used, StringBuilder path, String[] words) {
    if (ans.length()>0) return;
    if (path.length()==letters.length) {
      String s=path.toString();
      if (valid(s, words)) ans=s;
      return;
    }
    for (int i=0;i<letters.length;i++) {
      if (used[i]) continue;
      used[i]=true; path.append(letters[i]); dfs(letters, used, path, words);
      path.deleteCharAt(path.length()-1); used[i]=false;
    }
  }
  public String alienOrder(String[] words) {
    LinkedHashSet<Character> set=new LinkedHashSet<Character>();
    for (String w : words) for (char ch : w.toCharArray()) set.add(ch);
    char[] letters=new char[set.size()]; int k=0;
    for (char ch : set) letters[k++]=ch;
    ans="";
    dfs(letters, new boolean[letters.length], new StringBuilder(), words);
    return ans;
  }
}`,
    cpp: `class Solution {
  string ans;
  bool valid(const string& order, vector<string>& words) {
    int rank[128]={}; for (int i=0;i<(int)order.size();i++) rank[(int)order[i]]=i;
    for (int i=0;i<(int)words.size()-1;i++) {
      string a=words[i], b=words[i+1];
      int n=min((int)a.size(), (int)b.size()); bool diff=false;
      for (int j=0;j<n;j++) if (a[j]!=b[j]) {
        if (rank[(int)a[j]]>rank[(int)b[j]]) return false;
        diff=true; break;
      }
      if (!diff && a.size()>b.size()) return false;
    }
    return true;
  }
  void dfs(string& letters, vector<int>& used, string& path, vector<string>& words) {
    if (!ans.empty()) return;
    if (path.size()==letters.size()) { if (valid(path, words)) ans=path; return; }
    for (int i=0;i<(int)letters.size();i++) {
      if (used[i]) continue;
      used[i]=1; path.push_back(letters[i]); dfs(letters, used, path, words);
      path.pop_back(); used[i]=0;
    }
  }
public:
  string alienOrder(vector<string>& words) {
    string letters; int seen[128]={};
    for (auto& w : words) for (char ch : w) if (!seen[(int)ch]) { seen[(int)ch]=1; letters.push_back(ch); }
    ans=""; vector<int> used(letters.size()); string path;
    dfs(letters, used, path, words);
    return ans;
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
char ans_al[32];
int valid_al(const char* order, char** words, int nw) {
  int rank[128]={0};
  for (int i=0; order[i]; i++) rank[(int)order[i]]=i;
  for (int i=0;i<nw-1;i++) {
    char *a=words[i], *b=words[i+1];
    int na=(int)strlen(a), nb=(int)strlen(b), n=na<nb?na:nb, diff=0;
    for (int j=0;j<n;j++) if (a[j]!=b[j]) {
      if (rank[(int)a[j]]>rank[(int)b[j]]) return 0;
      diff=1; break;
    }
    if (!diff && na>nb) return 0;
  }
  return 1;
}
void dfs_al(char* letters, int k, int* used, char* path, int plen, char** words, int nw) {
  if (ans_al[0]) return;
  if (plen==k) { path[plen]=0; if (valid_al(path, words, nw)) strcpy(ans_al, path); return; }
  for (int i=0;i<k;i++) {
    if (used[i]) continue;
    used[i]=1; path[plen]=letters[i]; dfs_al(letters,k,used,path,plen+1,words,nw); used[i]=0;
  }
}
char* alienOrder(char** words, int nw) {
  char letters[32]; int k=0, seen[128]={0};
  for (int w=0;w<nw;w++) for (int i=0; words[w][i]; i++) {
    unsigned char ch=words[w][i]; if (!seen[ch]) { seen[ch]=1; letters[k++]=ch; }
  }
  ans_al[0]=0;
  int used[32]={0}; char path[32];
  dfs_al(letters,k,used,path,0,words,nw);
  char* out=(char*)malloc(32); strcpy(out, ans_al); return out;
}`
  },
  {
    python: `def alienOrder(words):
  g = {}
  state = {}
  for w in words:
    for ch in w:
      if ch not in g: g[ch]=set(); state[ch]=0
  for i in range(len(words)-1):
    a, b = words[i], words[i+1]
    n = min(len(a), len(b)); found=False
    for j in range(n):
      if a[j]!=b[j]:
        g[a[j]].add(b[j]); found=True; break
    if not found and len(a)>len(b): return ""
  out=[]; cycle=False
  def dfs(u):
    nonlocal cycle
    if state[u]==1: cycle=True; return
    if state[u]==2: return
    state[u]=1
    for v in list(g[u]): dfs(v)
    state[u]=2; out.append(u)
  for k in list(g.keys()): dfs(k)
  if cycle: return ""
  return "".join(reversed(out))`,
    java: `import java.util.*;
class Solution {
  boolean cycle;
  void dfs(char u, Map<Character, Set<Character>> g, int[] state, List<Character> out) {
    if (state[u]==1) { cycle=true; return; }
    if (state[u]==2) return;
    state[u]=1;
    for (char v : g.get(u)) dfs(v, g, state, out);
    state[u]=2; out.add(u);
  }
  public String alienOrder(String[] words) {
    Map<Character, Set<Character>> g=new HashMap<Character, Set<Character>>();
    int[] state=new int[128];
    for (String w : words) for (char ch : w.toCharArray()) if (!g.containsKey(ch)) g.put(ch, new HashSet<Character>());
    for (int i=0;i<words.length-1;i++) {
      String a=words[i], b=words[i+1];
      int n=Math.min(a.length(), b.length()); boolean found=false;
      for (int j=0;j<n;j++) if (a.charAt(j)!=b.charAt(j)) { g.get(a.charAt(j)).add(b.charAt(j)); found=true; break; }
      if (!found && a.length()>b.length()) return "";
    }
    List<Character> out=new ArrayList<Character>(); cycle=false;
    for (char k : g.keySet()) dfs(k, g, state, out);
    if (cycle) return "";
    Collections.reverse(out);
    StringBuilder sb=new StringBuilder();
    for (char c : out) sb.append(c);
    return sb.toString();
  }
}`,
    cpp: `class Solution {
  bool cycle;
  void dfs(char u, unordered_map<char, unordered_set<char>>& g, unordered_map<char,int>& state, string& out) {
    if (state[u]==1) { cycle=true; return; }
    if (state[u]==2) return;
    state[u]=1;
    for (char v : g[u]) dfs(v, g, state, out);
    state[u]=2; out.push_back(u);
  }
public:
  string alienOrder(vector<string>& words) {
    unordered_map<char, unordered_set<char>> g;
    unordered_map<char,int> state;
    for (auto& w : words) for (char ch : w) { if (!g.count(ch)) { g[ch]={}; state[ch]=0; } }
    for (int i=0;i<(int)words.size()-1;i++) {
      string a=words[i], b=words[i+1];
      int n=min((int)a.size(),(int)b.size()); bool found=false;
      for (int j=0;j<n;j++) if (a[j]!=b[j]) { g[a[j]].insert(b[j]); found=true; break; }
      if (!found && a.size()>b.size()) return "";
    }
    string out; cycle=false;
    for (auto& p : g) dfs(p.first, g, state, out);
    if (cycle) return "";
    reverse(out.begin(), out.end());
    return out;
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
int g_al[128][32], gd_al[128], state_al[128], out_al[32], on_al, cycle_al, present_al[128];
void dfs_al2(int u) {
  if (state_al[u]==1) { cycle_al=1; return; }
  if (state_al[u]==2) return;
  state_al[u]=1;
  for (int i=0;i<gd_al[u];i++) dfs_al2(g_al[u][i]);
  state_al[u]=2; out_al[on_al++]=u;
}
char* alienOrder(char** words, int nw) {
  memset(gd_al,0,sizeof(gd_al)); memset(state_al,0,sizeof(state_al)); memset(present_al,0,sizeof(present_al));
  on_al=0; cycle_al=0;
  for (int w=0;w<nw;w++) for (int i=0; words[w][i]; i++) present_al[(int)words[w][i]]=1;
  for (int i=0;i<nw-1;i++) {
    char *a=words[i], *b=words[i+1];
    int na=(int)strlen(a), nb=(int)strlen(b), n=na<nb?na:nb, found=0;
    for (int j=0;j<n;j++) if (a[j]!=b[j]) {
      int u=a[j], v=b[j], dup=0;
      for (int k=0;k<gd_al[u];k++) if (g_al[u][k]==v) dup=1;
      if (!dup) g_al[u][gd_al[u]++]=v;
      found=1; break;
    }
    if (!found && na>nb) { char* e=(char*)malloc(1); e[0]=0; return e; }
  }
  for (int c=0;c<128;c++) if (present_al[c]) dfs_al2(c);
  char* res=(char*)malloc(33); int p=0;
  if (cycle_al) { res[0]=0; return res; }
  for (int i=on_al-1;i>=0;i--) res[p++]=(char)out_al[i];
  res[p]=0; return res;
}`
  },
  {
    python: `from collections import deque
def alienOrder(words):
  g = {}; indeg = {}
  for w in words:
    for ch in w:
      if ch not in g: g[ch]=set(); indeg[ch]=0
  for i in range(len(words)-1):
    a, b = words[i], words[i+1]
    n = min(len(a), len(b)); found=False
    for j in range(n):
      if a[j]!=b[j]:
        if b[j] not in g[a[j]]:
          g[a[j]].add(b[j]); indeg[b[j]] += 1
        found=True; break
    if not found and len(a)>len(b): return ""
  q = deque([k for k in indeg if indeg[k]==0])
  order = ""
  while q:
    u = q.popleft(); order += u
    for v in list(g[u]):
      indeg[v]-=1
      if indeg[v]==0: q.append(v)
  return order if len(order)==len(indeg) else ""`,
    java: `import java.util.*;
class Solution {
  public String alienOrder(String[] words) {
    Map<Character, Set<Character>> g=new HashMap<Character, Set<Character>>();
    Map<Character, Integer> indeg=new HashMap<Character, Integer>();
    for (String w : words) for (char ch : w.toCharArray()) {
      if (!g.containsKey(ch)) { g.put(ch, new HashSet<Character>()); indeg.put(ch, 0); }
    }
    for (int i=0;i<words.length-1;i++) {
      String a=words[i], b=words[i+1];
      int n=Math.min(a.length(), b.length()); boolean found=false;
      for (int j=0;j<n;j++) if (a.charAt(j)!=b.charAt(j)) {
        if (!g.get(a.charAt(j)).contains(b.charAt(j))) {
          g.get(a.charAt(j)).add(b.charAt(j)); indeg.put(b.charAt(j), indeg.get(b.charAt(j))+1);
        }
        found=true; break;
      }
      if (!found && a.length()>b.length()) return "";
    }
    ArrayDeque<Character> q=new ArrayDeque<Character>();
    for (char k : indeg.keySet()) if (indeg.get(k)==0) q.addLast(k);
    StringBuilder order=new StringBuilder();
    while (!q.isEmpty()) {
      char u=q.pollFirst(); order.append(u);
      for (char v : g.get(u)) {
        indeg.put(v, indeg.get(v)-1);
        if (indeg.get(v)==0) q.addLast(v);
      }
    }
    return order.length()==indeg.size() ? order.toString() : "";
  }
}`,
    cpp: `class Solution {
public:
  string alienOrder(vector<string>& words) {
    unordered_map<char, unordered_set<char>> g;
    unordered_map<char,int> indeg;
    for (auto& w : words) for (char ch : w) if (!g.count(ch)) { g[ch]={}; indeg[ch]=0; }
    for (int i=0;i<(int)words.size()-1;i++) {
      string a=words[i], b=words[i+1];
      int n=min((int)a.size(),(int)b.size()); bool found=false;
      for (int j=0;j<n;j++) if (a[j]!=b[j]) {
        if (!g[a[j]].count(b[j])) { g[a[j]].insert(b[j]); indeg[b[j]]++; }
        found=true; break;
      }
      if (!found && a.size()>b.size()) return "";
    }
    queue<char> q;
    for (auto& p : indeg) if (p.second==0) q.push(p.first);
    string order;
    while (!q.empty()) {
      char u=q.front(); q.pop(); order+=u;
      for (char v : g[u]) { indeg[v]--; if (indeg[v]==0) q.push(v); }
    }
    return (int)order.size()==(int)indeg.size() ? order : "";
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
char* alienOrder(char** words, int nw) {
  int g[128][32]={0}, gd[128]={0}, indeg[128], present[128]={0};
  for (int i=0;i<128;i++) indeg[i]=-1;
  for (int w=0;w<nw;w++) for (int i=0; words[w][i]; i++) { present[(int)words[w][i]]=1; indeg[(unsigned char)words[w][i]]=0; }
  for (int i=0;i<nw-1;i++) {
    char *a=words[i], *b=words[i+1];
    int na=(int)strlen(a), nb=(int)strlen(b), n=na<nb?na:nb, found=0;
    for (int j=0;j<n;j++) if (a[j]!=b[j]) {
      int u=(unsigned char)a[j], v=(unsigned char)b[j], dup=0;
      for (int k=0;k<gd[u];k++) if (g[u][k]==v) dup=1;
      if (!dup) { g[u][gd[u]++]=v; indeg[v]++; }
      found=1; break;
    }
    if (!found && na>nb) { char* e=(char*)malloc(1); e[0]=0; return e; }
  }
  int q[32], h=0,t=0, keys=0;
  for (int c=0;c<128;c++) if (indeg[c]==0) q[t++]=c;
  for (int c=0;c<128;c++) if (present[c]) keys++;
  char* order=(char*)malloc(33); int p=0;
  while (h<t) {
    int u=q[h++]; order[p++]=(char)u;
    for (int i=0;i<gd[u];i++) { int v=g[u][i]; indeg[v]--; if (indeg[v]==0) q[t++]=v; }
  }
  order[p]=0;
  if (p!=keys) order[0]=0;
  return order;
}`
  }
];
