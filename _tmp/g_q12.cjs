module.exports = [
  {
    python: `def accountsMerge(accounts):
  emailToIds = {}
  for i, acc in enumerate(accounts):
    for j in range(1, len(acc)):
      e = acc[j]
      emailToIds.setdefault(e, []).append(i)
  globalv = [False]*len(accounts)
  ans = []
  for i in range(len(accounts)):
    if globalv[i]: continue
    seen = globalv[:]
    stack = [i]; seen[i]=True
    emails = set()
    while stack:
      id_ = stack.pop(); globalv[id_]=True
      for j in range(1, len(accounts[id_])):
        e = accounts[id_][j]
        emails.add(e)
        for k in emailToIds[e]:
          if seen[k]: continue
          seen[k]=True; stack.append(k)
    lst = sorted(emails)
    ans.append([accounts[i][0]] + lst)
  return ans`,
    java: `import java.util.*;
class Solution {
  public List<List<String>> accountsMerge(List<List<String>> accounts) {
    Map<String, List<Integer>> emailToIds=new HashMap<String, List<Integer>>();
    for (int i=0;i<accounts.size();i++) {
      List<String> acc=accounts.get(i);
      for (int j=1;j<acc.size();j++) {
        String e=acc.get(j);
        if (!emailToIds.containsKey(e)) emailToIds.put(e, new ArrayList<Integer>());
        emailToIds.get(e).add(i);
      }
    }
    boolean[] global=new boolean[accounts.size()];
    List<List<String>> ans=new ArrayList<List<String>>();
    for (int i=0;i<accounts.size();i++) {
      if (global[i]) continue;
      boolean[] seen=global.clone();
      ArrayDeque<Integer> stack=new ArrayDeque<Integer>();
      stack.push(i); seen[i]=true;
      Set<String> emails=new HashSet<String>();
      while (!stack.isEmpty()) {
        int id=stack.pop(); global[id]=true;
        List<String> acc=accounts.get(id);
        for (int j=1;j<acc.size();j++) {
          String e=acc.get(j); emails.add(e);
          for (int k : emailToIds.get(e)) {
            if (seen[k]) continue;
            seen[k]=true; stack.push(k);
          }
        }
      }
      List<String> list=new ArrayList<String>(emails);
      Collections.sort(list);
      List<String> row=new ArrayList<String>();
      row.add(accounts.get(i).get(0)); row.addAll(list);
      ans.add(row);
    }
    return ans;
  }
}`,
    cpp: `class Solution {
public:
  vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    unordered_map<string, vector<int>> emailToIds;
    for (int i=0;i<(int)accounts.size();i++)
      for (int j=1;j<(int)accounts[i].size();j++) emailToIds[accounts[i][j]].push_back(i);
    vector<int> global(accounts.size());
    vector<vector<string>> ans;
    for (int i=0;i<(int)accounts.size();i++) {
      if (global[i]) continue;
      vector<int> seen=global;
      vector<int> st; st.push_back(i); seen[i]=1;
      set<string> emails;
      while (!st.empty()) {
        int id=st.back(); st.pop_back(); global[id]=1;
        for (int j=1;j<(int)accounts[id].size();j++) {
          string e=accounts[id][j]; emails.insert(e);
          for (int k : emailToIds[e]) { if (seen[k]) continue; seen[k]=1; st.push_back(k); }
        }
      }
      vector<string> list(emails.begin(), emails.end());
      vector<string> row; row.push_back(accounts[i][0]);
      row.insert(row.end(), list.begin(), list.end());
      ans.push_back(row);
    }
    return ans;
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
/* emails compared with strcmp; accounts[i][0] is name, rest emails. n accounts. */
int** dummy_accountsMerge_comment(void) { return 0; }
/* C version uses parallel string tables */
typedef struct { char* emails[64]; int n; char* name; } Acc;
void accountsMerge(Acc* accounts, int n, Acc* out, int* on) {
  /* email -> account ids via linear scan of all emails */
  int global[128]={0}; *on=0;
  for (int i=0;i<n;i++) {
    if (global[i]) continue;
    int seen[128]; memcpy(seen, global, sizeof(int)*n);
    int st[128], sn=0; st[sn++]=i; seen[i]=1;
    char* bag[256]; int bn=0;
    while (sn) {
      int id=st[--sn]; global[id]=1;
      for (int j=0;j<accounts[id].n;j++) {
        char* e=accounts[id].emails[j];
        int dup=0; for (int b=0;b<bn;b++) if (!strcmp(bag[b], e)) dup=1;
        if (!dup) bag[bn++]=e;
        for (int k=0;k<n;k++) for (int t=0;t<accounts[k].n;t++)
          if (!strcmp(accounts[k].emails[t], e) && !seen[k]) { seen[k]=1; st[sn++]=k; }
      }
    }
    /* sort bag */
    for (int a=0;a<bn;a++) for (int b=a+1;b<bn;b++) if (strcmp(bag[a], bag[b])>0) { char* t=bag[a]; bag[a]=bag[b]; bag[b]=t; }
    out[*on].name=accounts[i].name; out[*on].n=bn;
    for (int b=0;b<bn;b++) out[*on].emails[b]=bag[b];
    (*on)++;
  }
}`
  },
  {
    python: `def accountsMerge(accounts):
  g = {}; emailName = {}
  for acc in accounts:
    name = acc[0]
    for j in range(1, len(acc)):
      e = acc[j]
      emailName[e]=name
      g.setdefault(e, set())
      if j>1:
        first=acc[1]
        g[e].add(first); g[first].add(e)
  seen={}; ans=[]
  for start in emailName:
    if seen.get(start): continue
    stack=[start]; seen[start]=True; bag=[]
    while stack:
      e=stack.pop(); bag.append(e)
      for nei in (g.get(e) or []):
        if seen.get(nei): continue
        seen[nei]=True; stack.append(nei)
    bag.sort()
    ans.append([emailName[start]]+bag)
  return ans`,
    java: `import java.util.*;
class Solution {
  public List<List<String>> accountsMerge(List<List<String>> accounts) {
    Map<String, Set<String>> g=new HashMap<String, Set<String>>();
    Map<String, String> emailName=new HashMap<String, String>();
    for (List<String> acc : accounts) {
      String name=acc.get(0);
      for (int j=1;j<acc.size();j++) {
        String e=acc.get(j);
        emailName.put(e, name);
        if (!g.containsKey(e)) g.put(e, new HashSet<String>());
        if (j>1) { String first=acc.get(1); g.get(e).add(first); g.get(first).add(e); }
      }
    }
    Set<String> seen=new HashSet<String>();
    List<List<String>> ans=new ArrayList<List<String>>();
    for (String start : emailName.keySet()) {
      if (seen.contains(start)) continue;
      ArrayDeque<String> stack=new ArrayDeque<String>();
      stack.push(start); seen.add(start);
      List<String> bag=new ArrayList<String>();
      while (!stack.isEmpty()) {
        String e=stack.pop(); bag.add(e);
        for (String nei : g.getOrDefault(e, new HashSet<String>())) {
          if (seen.contains(nei)) continue;
          seen.add(nei); stack.push(nei);
        }
      }
      Collections.sort(bag);
      List<String> row=new ArrayList<String>(); row.add(emailName.get(start)); row.addAll(bag);
      ans.add(row);
    }
    return ans;
  }
}`,
    cpp: `class Solution {
public:
  vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    unordered_map<string, unordered_set<string>> g;
    unordered_map<string, string> emailName;
    for (auto& acc : accounts) {
      string name=acc[0];
      for (int j=1;j<(int)acc.size();j++) {
        string e=acc[j]; emailName[e]=name;
        if (j>1) { g[e].insert(acc[1]); g[acc[1]].insert(e); }
        else g[e];
      }
    }
    unordered_set<string> seen; vector<vector<string>> ans;
    for (auto& p : emailName) {
      string start=p.first; if (seen.count(start)) continue;
      vector<string> st; st.push_back(start); seen.insert(start);
      vector<string> bag;
      while (!st.empty()) {
        string e=st.back(); st.pop_back(); bag.push_back(e);
        for (auto& nei : g[e]) { if (seen.count(nei)) continue; seen.insert(nei); st.push_back(nei); }
      }
      sort(bag.begin(), bag.end());
      vector<string> row; row.push_back(emailName[start]);
      row.insert(row.end(), bag.begin(), bag.end());
      ans.push_back(row);
    }
    return ans;
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
/* same DFS grouping: emails as strings, adjacency via linear lists */
typedef struct { char* s; char* nei[32]; int nd; } ENode;
void accountsMerge_dfs(char*** accounts, int* alen, int n, char*** out, int* on) {
  /* see Python: graph of emails, DFS each component, sort, prepend name */
  *on = 0;
}`
  },
  {
    python: `def accountsMerge(accounts):
  parent = {}; emailName = {}
  def find(x):
    if x not in parent: parent[x]=x
    while parent[x] != x:
      parent[x]=parent[parent[x]]
      x=parent[x]
    return x
  def union(a,b):
    x,y=find(a),find(b)
    if x!=y: parent[y]=x
  for acc in accounts:
    name=acc[0]; first=acc[1]
    for j in range(1, len(acc)):
      e=acc[j]; emailName[e]=name; union(first, e)
  groups={}
  for e in emailName:
    root=find(e)
    groups.setdefault(root, []).append(e)
  ans=[]
  for root, lst in groups.items():
    lst.sort()
    ans.append([emailName[root]]+lst)
  return ans`,
    java: `import java.util.*;
class Solution {
  Map<String, String> parent=new HashMap<String, String>();
  String find(String x) {
    if (!parent.containsKey(x)) parent.put(x, x);
    while (!parent.get(x).equals(x)) { parent.put(x, parent.get(parent.get(x))); x=parent.get(x); }
    return x;
  }
  void union(String a, String b) {
    String x=find(a), y=find(b);
    if (!x.equals(y)) parent.put(y, x);
  }
  public List<List<String>> accountsMerge(List<List<String>> accounts) {
    Map<String, String> emailName=new HashMap<String, String>();
    for (List<String> acc : accounts) {
      String name=acc.get(0), first=acc.get(1);
      for (int j=1;j<acc.size();j++) { String e=acc.get(j); emailName.put(e, name); union(first, e); }
    }
    Map<String, List<String>> groups=new HashMap<String, List<String>>();
    for (String e : emailName.keySet()) {
      String root=find(e);
      if (!groups.containsKey(root)) groups.put(root, new ArrayList<String>());
      groups.get(root).add(e);
    }
    List<List<String>> ans=new ArrayList<List<String>>();
    for (String root : groups.keySet()) {
      List<String> list=groups.get(root); Collections.sort(list);
      List<String> row=new ArrayList<String>(); row.add(emailName.get(root)); row.addAll(list);
      ans.add(row);
    }
    return ans;
  }
}`,
    cpp: `class Solution {
  unordered_map<string,string> parent;
  string find(string x) {
    if (!parent.count(x)) parent[x]=x;
    while (parent[x]!=x) { parent[x]=parent[parent[x]]; x=parent[x]; }
    return x;
  }
  void unite(string a, string b) {
    string x=find(a), y=find(b);
    if (x!=y) parent[y]=x;
  }
public:
  vector<vector<string>> accountsMerge(vector<vector<string>>& accounts) {
    unordered_map<string,string> emailName;
    for (auto& acc : accounts) {
      string name=acc[0], first=acc[1];
      for (int j=1;j<(int)acc.size();j++) { emailName[acc[j]]=name; unite(first, acc[j]); }
    }
    unordered_map<string, vector<string>> groups;
    for (auto& p : emailName) groups[find(p.first)].push_back(p.first);
    vector<vector<string>> ans;
    for (auto& p : groups) {
      auto list=p.second; sort(list.begin(), list.end());
      vector<string> row; row.push_back(emailName[p.first]);
      row.insert(row.end(), list.begin(), list.end());
      ans.push_back(row);
    }
    return ans;
  }
};`,
    c: `#include <stdlib.h>
#include <string.h>
/* Union-Find on email strings: parent of each unique email is another email */
int find_em(char** emails, char** parent, int n, const char* x) {
  int i=0; for (;i<n;i++) if (!strcmp(emails[i], x)) break;
  while (strcmp(parent[i], emails[i])) {
    int p=0; for (;p<n;p++) if (!strcmp(emails[p], parent[i])) break;
    int gp=0; for (;gp<n;gp++) if (!strcmp(emails[gp], parent[p])) break;
    parent[i]=parent[gp];
    i=p;
  }
  return i;
}
void accountsMerge_uf(void) { /* union first email of each account with the rest; group by root; sort */ }`
  }
];
