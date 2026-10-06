window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dsa-linkedlist"] = {
  kind: "dsa",
  notes: [
    {
      title: "What a linked list is",
      body: "A linked list is a chain of nodes. Each node stores a value and a pointer named next that leads to the next node. The last node points at null. You do not get random index access like an array. To reach the fifth node you walk five steps from the head. Inserting or deleting at a known node is cheap because you only change a few pointers. The trade-off is that a walk is always linear."
    },
    {
      title: "Head, tail, and null",
      body: "The head is the first node, the door into the list. If head is null the list is empty. After a reverse, a new node becomes the head. Losing the head pointer loses the whole list, so keep a name on it while you walk. The tail is the last real node, the one whose next is null. Many problems ask you to return the new head, not to mutate a global."
    },
    {
      title: "Dummy / sentinel node",
      body: "A dummy node sits in front of the real head. You never return the dummy; you return dummy.next. It soaks up edge cases: delete the first node, merge into an empty list, or build a result from scratch. Without a dummy you write extra ifs for 'is this still the head?'. Draw the dummy as a fake box whose next starts at head or null."
    },
    {
      title: "Two pointers",
      body: "Two names can walk the same list at different speeds or with a fixed gap. Slow and fast (tortoise and hare) find the middle or a cycle: fast jumps two nodes, slow jumps one. To drop the nth node from the end, send fast n steps ahead, then walk both until fast falls off. When you only have next, two pointers replace the index math you would do on an array."
    },
    {
      title: "Reversing next pointers",
      body: "Reverse means each node should point at the node that used to come before it. Iterative reverse keeps prev, cur, and next. Save cur.next, set cur.next = prev, then slide prev and cur forward. At the end prev is the new head. Recursive reverse solves the suffix first, then hangs the current node on the old next. Both are O(n) time. Iterative uses O(1) extra space."
    },
    {
      title: "Recursion on a list",
      body: "A list is a node plus a shorter list. The recursive case is 'fix head.next, then fix head'. The base is null or a single node. Recursion uses the call stack as implicit memory, so space is O(n) in the worst case. Interviewers often want the iterative pointer version after you show you understand the recursive picture."
    },
    {
      title: "Cycles",
      body: "A cycle means some next points back at an earlier node, so a walk never hits null. Storing every visited node in a Set detects a repeat. Floyd's method uses no extra set: if fast and slow ever meet, a cycle exists. To find the start, put one pointer at head and one at the meeting node, then walk both one step at a time; they meet at the entrance."
    },
    {
      title: "Array extra space vs in-place",
      body: "Copying every value into an array makes palindrome checks, reversals, and k-group work look like normal index problems. That is the brute pattern: O(n) extra memory and a rebuild. In-place pointer work is what interviews grade. If the list must stay linked, change next (and prev on a doubly list). Say the extra-array idea first, then flip pointers."
    },
    {
      title: "Doubly lists and extra pointers",
      body: "A doubly linked node has prev and next. LRU cache and flatten-multilevel use that extra back pointer. A node may also have random or child. Copying such a graph needs a map from old node to new node, or a weave trick that parks the copy in next. Always null-check before you read .next, .prev, .child, or .random."
    },
    {
      title: "Interview habit",
      body: "Draw boxes and arrows before you type. Name the head you will return. Walk a 1-2-3 example and an empty list. Count length when the problem talks about n from the end, then show the one-pass gap. For classes like LRU, state get and put both O(1) and how the map plus list keep recency. Then open the Brute, Optimal, and More optimal tabs."
    }
  ],
  examples: [
    {
      lang: "js",
      title: "1. Make a ListNode",
      desc: "What this is\nA ListNode is one box: a number in val and a pointer in next.\nnew ListNode(1) makes a box whose next is null.\nLinking boxes by assignment builds a chain.\n\nWhat the code is doing\nListNode stores val and next, defaulting next to null.\na, b, and c are three boxes holding 1, 2, and 3.\na.next = b and b.next = c make the chain 1 -> 2 -> 3 -> null.\nhead is just another name for a.\n\nWatch out\nForgetting to set next leaves an isolated node.\nIf you overwrite head, you can lose the start of the chain.",
      code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

const a = new ListNode(1);
const b = new ListNode(2);
const c = new ListNode(3);
a.next = b;
b.next = c;

const head = a; // 1 -> 2 -> 3`,
      codes: {
        javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

const a = new ListNode(1);
const b = new ListNode(2);
const c = new ListNode(3);
a.next = b;
b.next = c;

const head = a; // 1 -> 2 -> 3`,
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
a = ListNode(1)
b = ListNode(2)
c = ListNode(3)
a.next = b
b.next = c
head = a
  # 1 -> 2 -> 3`,
        java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode example() {
        ListNode a = new ListNode(1);
        ListNode b = new ListNode(2);
        ListNode c = new ListNode(3);
        a.next = b;
        b.next = c;
        ListNode head = a;
        // 1 -> 2 -> 3;
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* example() {
    ListNode* a = new ListNode(1);
    ListNode* b = new ListNode(2);
    ListNode* c = new ListNode(3);
    a->next = b;
    b->next = c;
    ListNode* head = a;
    // 1 -> 2 -> 3;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* example() {
    struct Node* a = newNode(1);
    struct Node* b = newNode(2);
    struct Node* c = newNode(3);
    a->next = b;
    b->next = c;
    struct Node* head = a;
    // 1 -> 2 -> 3;
}`
      }
    },
    {
      lang: "js",
      title: "2. Walk every node",
      desc: "What this is\nWalking a list means starting at head and following next until you hit null.\nYou cannot jump to index 2; you take two steps.\nThis loop is the backbone of almost every list problem.\n\nWhat the code is doing\ncur starts at head.\nThe while loop runs while cur is a real node.\nIt prints cur.val, then moves cur to cur.next.\nWhen cur becomes null the walk stops.\n\nWatch out\nThe loop condition must be cur, not cur.next, if you need the last node too.\nChanging cur does not change head unless you assigned through head.",
      code: `function walk(head) {
  let cur = head;
  while (cur) {
    console.log(cur.val);
    cur = cur.next;
  }
}`,
      codes: {
        javascript: `function walk(head) {
  let cur = head;
  while (cur) {
    console.log(cur.val);
    cur = cur.next;
  }
}`,
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def walk(head):
    cur = head
    while cur:
        print(cur.val)
        cur = cur.next`,
        java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public void walk(ListNode head) {
        ListNode cur = head;
        while (cur != null) {
            System.out.println(cur.val);
            cur = cur.next;
        }
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

void walk(ListNode* head) {
    ListNode* cur = head;
    while (cur) {
        cout << cur->val << "\\n";
        cur = cur->next;
    }
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

void walk(struct Node* head) {
    struct Node* cur = head;
    while (cur) {
        printf("%d\\n", cur->val);
        cur = cur->next;
    }
}`
      }
    },
    {
      lang: "js",
      title: "3. Dummy head",
      desc: "What this is\nA dummy is a fake first node you never return.\nYou grow the real list off dummy.next.\nDeletes and merges become uniform: you always edit some node.next.\n\nWhat the code is doing\ndummy holds 0 and starts with next null.\ntail is the last node of the result, starting at dummy.\nEach push makes a new node, hangs it on tail.next, then slides tail.\nThe function returns dummy.next, the true head.\n\nWatch out\nReturning dummy itself would leak the fake 0 into the answer.\nKeep tail at the last real node so the next push appends, not overwrites.",
      code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function fromArray(vals) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
      codes: {
        javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function fromArray(vals) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def fromArray(vals):
    dummy = ListNode(0)
    tail = dummy
    for v in vals:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next`,
        java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode fromArray(int[] vals) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (var v : vals) {
            tail.next = new ListNode(v);
            tail = tail.next;
        }
        return dummy.next;
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* fromArray(vector<int>& vals) {
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    for (auto v : vals) {
        tail->next = new ListNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* fromArray(int* vals, int valsn) {
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    for (int _i = 0; _i < valsn; _i++) { int v = vals[_i];
        tail->next = newNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`
      }
    },
    {
      lang: "js",
      title: "4. Reverse with three names",
      desc: "What this is\nIn-place reverse flips each next to point backward.\nYou need the old next saved before you overwrite it.\nprev trails behind, cur is the node you flip, next is the rest of the list.\n\nWhat the code is doing\nprev starts null because the old head will become the new tail.\nEach round saves cur.next, points cur at prev, then slides prev and cur.\nWhen cur is null, prev is the new head.\n\nWatch out\nIf you skip saving next, you lose the rest of the list.\nDo not return cur; cur is null at the end.",
      code: `function reverse(head) {
  let prev = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
      codes: {
        javascript: `function reverse(head) {
  let prev = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def reverse(head):
    prev = None
    cur = head
    while cur:
        next = cur.next
        cur.next = prev
        prev = cur
        cur = next
    return prev`,
        java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode reverse(ListNode head) {
        ListNode prev = null;
        ListNode cur = head;
        while (cur != null) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* reverse(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* cur = head;
    while (cur) {
        ListNode* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* reverse(struct Node* head) {
    struct Node* prev = NULL;
    struct Node* cur = head;
    while (cur) {
        struct Node* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`
      }
    },
    {
      lang: "js",
      title: "5. Slow and fast pointers",
      desc: "What this is\nSlow moves one node. Fast moves two.\nWhen fast hits the end, slow sits at the middle.\nThe same idea later detects cycles: if they ever meet, a loop exists.\n\nWhat the code is doing\nBoth names start at head.\nThe loop continues while fast and fast.next exist, so a two-step is safe.\nslow takes one step, fast takes two.\nThe function returns slow, the middle node (the second middle on even length).\n\nWatch out\nCheck fast.next before you read fast.next.next.\nOn a one-node list the loop never runs and you correctly return head.",
      code: `function middle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
      codes: {
        javascript: `function middle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def middle(head):
    slow = head
    fast = head
    while fast  and  fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
        java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode middle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* middle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
    }
    return slow;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* middle(struct Node* head) {
    struct Node* slow = head;
    struct Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
    }
    return slow;
}`
      }
    },
    {
      lang: "js",
      title: "6. Detect a cycle",
      desc: "What this is\nFloyd's cycle test uses slow and fast on the same list.\nIf there is no cycle, fast falls off to null.\nIf there is a cycle, fast laps slow and they meet.\n\nWhat the code is doing\nslow and fast start at head.\nEach round slow moves one and fast moves two, with null checks.\nIf they ever point at the same node, return true.\nIf the loop ends, there was no cycle.\n\nWatch out\nMeeting is about object identity, not equal val.\nTwo nodes can hold the same number without being a cycle.",
      code: `function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
      codes: {
        javascript: `function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def hasCycle(head):
    slow = head
    fast = head
    while fast  and  fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
        java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                return true;
            }
        }
        return false;
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
        if (slow == fast) {
            return true;
        }
    }
    return false;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool hasCycle(struct Node* head) {
    struct Node* slow = head;
    struct Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
        if (slow == fast) {
            return true;
        }
    }
    return false;
}`
      }
    },
    {
      lang: "js",
      title: "7. Merge two sorted chains",
      desc: "What this is\nYou have two lists already sorted by val.\nMerge walks both and always takes the smaller head.\nA dummy holds the start of the merged result.\n\nWhat the code is doing\ntail starts at dummy.\nWhile both lists still have nodes, the smaller val is appended and that list advances.\nAfter one list empties, tail.next takes the leftover chain.\nReturn dummy.next.\n\nWatch out\nYou compare a.val and b.val, then move only that list.\nForgetting the leftover append drops the rest of the longer list.",
      code: `function merge(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val < b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a || b;
  return dummy.next;
}`,
      codes: {
        javascript: `function merge(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val < b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a || b;
  return dummy.next;
}`,
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def merge(a, b):
    dummy = ListNode(0)
    tail = dummy
    while a  and  b:
        if a.val < b.val:
            tail.next = a
            a = a.next
        else:
            tail.next = b
            b = b.next
        tail = tail.next
    tail.next = a  or  b
    return dummy.next`,
        java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode merge(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (a != null && b != null) {
            if (a.val < b.val) {
                tail.next = a;
                a = a.next;
            }
            else {
                tail.next = b;
                b = b.next;
            }
            tail = tail.next;
        }
        tail.next = a || b;
        return dummy.next;
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* merge(ListNode* a, ListNode* b) {
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    while (a && b) {
        if (a->val < b->val) {
            tail->next = a;
            a = a->next;
        }
        else {
            tail->next = b;
            b = b->next;
        }
        tail = tail->next;
    }
    tail->next = a || b;
    return dummy->next;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* merge(struct Node* a, struct Node* b) {
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    while (a && b) {
        if (a->val < b->val) {
            tail->next = a;
            a = a->next;
        }
        else {
            tail->next = b;
            b = b->next;
        }
        tail = tail->next;
    }
    tail->next = a || b;
    return dummy->next;
}`
      }
    },
    {
      lang: "js",
      title: "8. Recursion on next",
      desc: "What this is\nThe rest of the list is head.next.\nA recursive function solves the suffix, then uses the current node.\nThe call stack remembers nodes you still need to finish.\n\nWhat the code is doing\nIf head is null, the sum is 0.\nOtherwise the answer is this val plus the sum of the rest.\nEach call peels one node.\nThe prints happen as the stack unwinds if you add logs after the recursive call.\n\nWatch out\nA list of thousands of nodes can overflow the stack.\nInterviews often ask for the iterative twin after you show recursion.",
      code: `function sumList(head) {
  if (!head) return 0;
  return head.val + sumList(head.next);
}`,
      codes: {
        javascript: `function sumList(head) {
  if (!head) return 0;
  return head.val + sumList(head.next);
}`,
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def sumList(head):
    if not head:
        return 0
    return head.val + sumList(head.next)`,
        java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public int sumList(ListNode head) {
        if (head == null) {
            return 0;
        }
        return head.val + sumList(head.next);
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

int sumList(ListNode* head) {
    if (!head) {
        return 0;
    }
    return head->val + sumList(head->next);
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int sumList(struct Node* head) {
    if (!head) {
        return 0;
    }
    return head->val + sumList(head->next);
}`
      }
    },
    {
      lang: "js",
      title: "9. List to array and back",
      desc: "What this is\nCopying values into an array is the brute pattern.\nArrays give indexes, reverse, and two-pointer checks for free.\nYou then rebuild a new list from the array.\n\nWhat the code is doing\ntoArray walks and pushes each val.\nfromArray uses a dummy and appends a node per number.\nTogether they round-trip a list through index land.\n\nWatch out\nThe new list has new node objects. Intersection and cycle problems care about identity, not copied values.\nThis uses O(n) extra memory.",
      code: `function toArray(head) {
  const vals = [];
  let cur = head;
  while (cur) {
    vals.push(cur.val);
    cur = cur.next;
  }
  return vals;
}

function fromArray(vals) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
      codes: {
        javascript: `function toArray(head) {
  const vals = [];
  let cur = head;
  while (cur) {
    vals.push(cur.val);
    cur = cur.next;
  }
  return vals;
}

function fromArray(vals) {
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
        python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def toArray(head):
    vals = []
    cur = head
    while cur:
        vals.append(cur.val)
        cur = cur.next
    return vals
def fromArray(vals):
    dummy = ListNode(0)
    tail = dummy
    for v in vals:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next`,
        java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public List<Integer> toArray(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        ListNode cur = head;
        while (cur != null) {
            vals.add(cur.val);
            cur = cur.next;
        }
        return vals;
    }

    public ListNode fromArray(int[] vals) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (var v : vals) {
            tail.next = new ListNode(v);
            tail = tail.next;
        }
        return dummy.next;
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

vector<int> toArray(ListNode* head) {
    vector<int> vals;
    ListNode* cur = head;
    while (cur) {
        vals.push_back(cur->val);
        cur = cur->next;
    }
    return vals;
}

ListNode* fromArray(vector<int>& vals) {
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    for (auto v : vals) {
        tail->next = new ListNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int* toArray(struct Node* head) {
    int vals[10005]; int valsn = 0;
    struct Node* cur = head;
    while (cur) {
        vals[valsn++] = cur->val;
        cur = cur->next;
    }
    return vals;
}

struct Node* fromArray(int* vals, int valsn) {
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    for (int _i = 0; _i < valsn; _i++) { int v = vals[_i];
        tail->next = newNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`
      }
    },
    {
      lang: "js",
      title: "10. Doubly linked node",
      desc: "What this is\nA doubly linked node has prev as well as next.\nLRU cache moves a node to the front in O(1) using both pointers.\nFlatten-multilevel also uses prev when splicing a child list.\n\nWhat the code is doing\nDNode stores key, val, prev, and next.\nlink puts b after a: a.next = b and b.prev = a.\nBoth directions must be set or a walk backward breaks.\n\nWatch out\nUpdating only next leaves a stale prev and creates a mess.\nSentinel head/tail nodes keep real nodes away from null checks.",
      code: `function DNode(key, val) {
  this.key = key;
  this.val = val;
  this.prev = null;
  this.next = null;
}

function link(a, b) {
  a.next = b;
  b.prev = a;
}`,
      codes: {
        javascript: `function DNode(key, val) {
  this.key = key;
  this.val = val;
  this.prev = null;
  this.next = null;
}

function link(a, b) {
  a.next = b;
  b.prev = a;
}`,
        python: `class DNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None
def link(a, b):
    a.next = b
    b.prev = a`,
        java: `import java.util.*;

class DNode {
    int key;
    int val;
    DNode prev;
    DNode next;
    DNode(int key, int val) { this.key = key; this.val = val; }
}

class Solution {
    public DNode link(DNode a, DNode b) {
        a.next = b;
        b.prev = a;
    }
}`,
        cpp: `#include <bits/stdc++.h>
using namespace std;

struct DNode {
    int key;
    int val;
    DNode* prev;
    DNode* next;
    DNode(int k, int v) : key(k), val(v), prev(nullptr), next(nullptr) {}
};

DNode* link(DNode* a, DNode* b) {
    a->next = b;
    b->prev = a;
}`,
        c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct DNode {
    int key;
    int val;
    struct DNode* prev;
    struct DNode* next;
};

struct DNode* newDNode(int key, int val) {
    struct DNode* n = (struct DNode*)malloc(sizeof(struct DNode));
    n->key = key;
    n->val = val;
    n->prev = NULL;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* link(struct Node* a, struct Node* b) {
    a->next = b;
    b->prev = a;
}`
      }
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "Reverse Linked List",
      ask: "Amazon · Google · Microsoft · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/reverse-linked-list/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/reverse-a-linked-list/1"}],
      a: "You get the head of a singly linked list. Return the head of the same nodes with every next pointer flipped.\n\n1 -> 2 -> 3 -> null becomes 3 -> 2 -> 1 -> null. An empty list stays empty. A single node stays itself.\n\nThe brute path copies values, reverses the array, and builds a new list. Recursion reverses the suffix then hangs the current node on its old next. The iterative walk uses prev, cur, and next and needs only a handful of pointers.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Copy every value into an array, reverse the array, then build a brand new list. Easy to see, but it allocates n extra nodes and ignores that you can flip next in place.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseList(head) {
  const vals = [];
  let cur = head;
  while (cur) {
    vals.push(cur.val);
    cur = cur.next;
  }
  vals.reverse();
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseList(head) {
  const vals = [];
  let cur = head;
  while (cur) {
    vals.push(cur.val);
    cur = cur.next;
  }
  vals.reverse();
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def reverseList(head):
    vals = []
    cur = head
    while cur:
        vals.append(cur.val)
        cur = cur.next
    vals.reverse()
    dummy = ListNode(0)
    tail = dummy
    for v in vals:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        ListNode cur = head;
        while (cur != null) {
            vals.add(cur.val);
            cur = cur.next;
        }
        Collections.reverse(vals);
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (var v : vals) {
            tail.next = new ListNode(v);
            tail = tail.next;
        }
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* reverseList(ListNode* head) {
    vector<int> vals;
    ListNode* cur = head;
    while (cur) {
        vals.push_back(cur->val);
        cur = cur->next;
    }
    reverse(vals.begin(), vals.end());
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    for (auto v : vals) {
        tail->next = new ListNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* reverseList(struct Node* head) {
    int vals[10005]; int valsn = 0;
    struct Node* cur = head;
    while (cur) {
        vals[valsn++] = cur->val;
        cur = cur->next;
    }
    /* reverse */;
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    for (int _i = 0; _i < valsn; _i++) { int v = vals[_i];
        tail->next = newNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Recurse to the end, then set head.next.next = head and cut head.next. The call stack holds every node, so space is O(n). Clear picture of 'suffix first'.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseList(head) {
  if (!head || !head.next) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseList(head) {
  if (!head || !head.next) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def reverseList(head):
    if not head  or  not head.next:
        return head
    newHead = reverseList(head.next)
    head.next.next = head
    head.next = None
    return newHead`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode newHead = reverseList(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* reverseList(ListNode* head) {
    if (!head || !head->next) {
        return head;
    }
    ListNode* newHead = reverseList(head->next);
    head->next.next = head;
    head->next = nullptr;
    return newHead;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* reverseList(struct Node* head) {
    if (!head || !head->next) {
        return head;
    }
    struct Node* newHead = reverseList(head->next);
    head->next.next = head;
    head->next = NULL;
    return newHead;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Iterative three-pointer reverse. Each node is visited once. Extra memory is a few names, not the stack and not a new list. This is the usual interview target.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseList(head) {
  let prev = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseList(head) {
  let prev = null;
  let cur = head;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def reverseList(head):
    prev = None
    cur = head
    while cur:
        next = cur.next
        cur.next = prev
        prev = cur
        cur = next
    return prev`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode cur = head;
        while (cur != null) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        return prev;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* reverseList(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* cur = head;
    while (cur) {
        ListNode* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* reverseList(struct Node* head) {
    struct Node* prev = NULL;
    struct Node* cur = head;
    while (cur) {
        struct Node* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`
          }
        }
      ]
    },
    {
      id: 2,
      level: "beginner",
      q: "Linked List Cycle",
      ask: "Amazon · Microsoft · Apple · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/linked-list-cycle/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/detect-loop-in-linked-list/1"}],
      a: "Return true if the list has a cycle, false if a walk hits null.\n\nIf pos is 1 on 3 -> 2 -> 0 -> -4, the tail points at 2 and a walk never ends. If every next is forward, you eventually reach null.\n\nBrute stores every node you have seen and scans the list of seen nodes. A Set makes the same idea O(1) per lookup. Floyd moves slow by one and fast by two; a meeting means a loop.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n²)",
          space: "O(n)",
          why: "Keep an array of visited nodes. For each new node, scan the array for the same object. Correct, but the scan makes it quadratic.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function hasCycle(head) {
  const seen = [];
  let cur = head;
  while (cur) {
    for (let i = 0; i < seen.length; i++) {
      if (seen[i] === cur) return true;
    }
    seen.push(cur);
    cur = cur.next;
  }
  return false;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function hasCycle(head) {
  const seen = [];
  let cur = head;
  while (cur) {
    for (let i = 0; i < seen.length; i++) {
      if (seen[i] === cur) return true;
    }
    seen.push(cur);
    cur = cur.next;
  }
  return false;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def hasCycle(head):
    seen = []
    cur = head
    while cur:
        for i in range(len(seen)):
            if seen[i] == cur:
                return True
        seen.append(cur)
        cur = cur.next
    return False`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public boolean hasCycle(ListNode head) {
        List<ListNode> seen = new ArrayList<>();
        ListNode cur = head;
        while (cur != null) {
            for (int i = 0; i < seen.size(); i++) {
                if (seen[i] == cur) {
                    return true;
                }
            }
            seen.add(cur);
            cur = cur.next;
        }
        return false;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

bool hasCycle(ListNode* head) {
    vector<ListNode*> seen;
    ListNode* cur = head;
    while (cur) {
        for (int i = 0; i < seen.size(); i++) {
            if (seen[i] == cur) {
                return true;
            }
        }
        seen.push_back(cur);
        cur = cur->next;
    }
    return false;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool hasCycle(struct Node* head) {
    struct Node* seen[10005]; int seenn = 0;
    struct Node* cur = head;
    while (cur) {
        for (int i = 0; i < seenn; i++) {
            if (seen[i] == cur) {
                return true;
            }
        }
        seen[seenn++] = cur;
        cur = cur->next;
    }
    return false;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "A Set stores nodes you already walked. Add is O(1) on average. First repeat means a cycle. Extra memory equals the number of distinct nodes before a repeat.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function hasCycle(head) {
  const seen = new Set();
  let cur = head;
  while (cur) {
    if (seen.has(cur)) return true;
    seen.add(cur);
    cur = cur.next;
  }
  return false;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function hasCycle(head) {
  const seen = new Set();
  let cur = head;
  while (cur) {
    if (seen.has(cur)) return true;
    seen.add(cur);
    cur = cur.next;
  }
  return false;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def hasCycle(head):
    seen = set()
    cur = head
    while cur:
        if (cur in seen):
            return True
        seen.add(cur)
        cur = cur.next
    return False`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public boolean hasCycle(ListNode head) {
        Set<ListNode> seen = new HashSet<>();
        ListNode cur = head;
        while (cur != null) {
            if (seen.contains(cur)) {
                return true;
            }
            seen.add(cur);
            cur = cur.next;
        }
        return false;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

bool hasCycle(ListNode* head) {
    unordered_set<ListNode*> seen;
    ListNode* cur = head;
    while (cur) {
        if (seen.count(cur)) {
            return true;
        }
        seen.insert(cur);
        cur = cur->next;
    }
    return false;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool hasCycle(struct Node* head) {
    struct Node* seen[10005]; int seenn = 0;
    struct Node* cur = head;
    while (cur) {
        if (containsPtr(seen, seenn, cur)) {
            return true;
        }
        seen[seenn++] = cur;
        cur = cur->next;
    }
    return false;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Floyd: slow +1, fast +2. No set. If they meet, there is a cycle. If fast hits null, there is not. Constant extra pointers.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function hasCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def hasCycle(head):
    slow = head
    fast = head
    while fast  and  fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public boolean hasCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                return true;
            }
        }
        return false;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

bool hasCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
        if (slow == fast) {
            return true;
        }
    }
    return false;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool hasCycle(struct Node* head) {
    struct Node* slow = head;
    struct Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
        if (slow == fast) {
            return true;
        }
    }
    return false;
}`
          }
        }
      ]
    },
    {
      id: 3,
      level: "intermediate",
      q: "Linked List Cycle II",
      ask: "Amazon · Microsoft · Google · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/linked-list-cycle-ii/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/find-the-first-node-of-loop-in-linked-list--170685/1"}],
      a: "If the list has a cycle, return the node where the cycle begins. If not, return null.\n\nOn 3 -> 2 -> 0 -> -4 with the tail linked to 2, the start is the node holding 2. Identity matters: you return that node object, not a copy.\n\nA Set records the first repeat. After Floyd finds a meeting point you can collect the cycle into a set and walk from head. The tight version resets one pointer to head and walks both one step; they meet at the entrance.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Walk from head. The first node already in the Set is the start of the cycle. If you reach null, there is no cycle.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function detectCycle(head) {
  const seen = new Set();
  let cur = head;
  while (cur) {
    if (seen.has(cur)) return cur;
    seen.add(cur);
    cur = cur.next;
  }
  return null;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function detectCycle(head) {
  const seen = new Set();
  let cur = head;
  while (cur) {
    if (seen.has(cur)) return cur;
    seen.add(cur);
    cur = cur.next;
  }
  return null;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def detectCycle(head):
    seen = set()
    cur = head
    while cur:
        if (cur in seen):
            return cur
        seen.add(cur)
        cur = cur.next
    return None`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode detectCycle(ListNode head) {
        Set<ListNode> seen = new HashSet<>();
        ListNode cur = head;
        while (cur != null) {
            if (seen.contains(cur)) {
                return cur;
            }
            seen.add(cur);
            cur = cur.next;
        }
        return null;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* detectCycle(ListNode* head) {
    unordered_set<ListNode*> seen;
    ListNode* cur = head;
    while (cur) {
        if (seen.count(cur)) {
            return cur;
        }
        seen.insert(cur);
        cur = cur->next;
    }
    return nullptr;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* detectCycle(struct Node* head) {
    struct Node* seen[10005]; int seenn = 0;
    struct Node* cur = head;
    while (cur) {
        if (containsPtr(seen, seenn, cur)) {
            return cur;
        }
        seen[seenn++] = cur;
        cur = cur->next;
    }
    return NULL;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Floyd finds a node inside the cycle. Walk that loop once into a Set. Then walk from head until you hit a node in the set. Extra memory is the cycle length.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function detectCycle(head) {
  let slow = head;
  let fast = head;
  let meet = null;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      meet = slow;
      break;
    }
  }
  if (!meet) return null;
  const inCycle = new Set();
  let p = meet;
  do {
    inCycle.add(p);
    p = p.next;
  } while (p !== meet);
  let q = head;
  while (!inCycle.has(q)) q = q.next;
  return q;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function detectCycle(head) {
  let slow = head;
  let fast = head;
  let meet = null;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      meet = slow;
      break;
    }
  }
  if (!meet) return null;
  const inCycle = new Set();
  let p = meet;
  do {
    inCycle.add(p);
    p = p.next;
  } while (p !== meet);
  let q = head;
  while (!inCycle.has(q)) q = q.next;
  return q;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def detectCycle(head):
    slow = head
    fast = head
    meet = None
    while fast  and  fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            meet = slow
            break
    if not meet:
        return None
    inCycle = set()
    p = meet
    while True:
        inCycle.add(p)
        p = p.next
        if not (p != meet):
            break
    q = head
    while not (q in inCycle):
        q = q.next
    return q`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        ListNode meet = null;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                meet = slow;
                break;
            }
        }
        if (meet == null) {
            return null;
        }
        Set<ListNode> inCycle = new HashSet<>();
        ListNode p = meet;
        do {
            inCycle.add(p);
            p = p.next;
        } while (p != meet);
        ListNode q = head;
        while (!inCycle.contains(q)) {
            q = q.next;
        }
        return q;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* detectCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    ListNode* meet = nullptr;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
        if (slow == fast) {
            meet = slow;
            break;
        }
    }
    if (!meet) {
        return nullptr;
    }
    unordered_set<ListNode*> inCycle;
    ListNode* p = meet;
    do {
        inCycle.insert(p);
        p = p->next;
    } while (p != meet);
    ListNode* q = head;
    while (!inCycle.count(q)) {
        q = q->next;
    }
    return q;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* detectCycle(struct Node* head) {
    struct Node* slow = head;
    struct Node* fast = head;
    struct Node* meet = NULL;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
        if (slow == fast) {
            meet = slow;
            break;
        }
    }
    if (!meet) {
        return NULL;
    }
    struct Node* inCycle[10005]; int inCyclen = 0;
    struct Node* p = meet;
    do {
        inCycle[inCyclen++] = p;
        p = p->next;
    } while (p != meet);
    struct Node* q = head;
    while (!containsPtr(inCycle, inCyclen, q)) {
        q = q->next;
    }
    return q;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "After slow and fast meet, put one pointer at head. Walk both one step at a time. They meet at the cycle start. Proof: distance from head to start equals distance from meet to start around the loop. No extra set.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function detectCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let p = head;
      while (p !== slow) {
        p = p.next;
        slow = slow.next;
      }
      return p;
    }
  }
  return null;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function detectCycle(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      let p = head;
      while (p !== slow) {
        p = p.next;
        slow = slow.next;
      }
      return p;
    }
  }
  return null;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def detectCycle(head):
    slow = head
    fast = head
    while fast  and  fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            p = head
            while p != slow:
                p = p.next
                slow = slow.next
            return p
    return None`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode detectCycle(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
            if (slow == fast) {
                ListNode p = head;
                while (p != slow) {
                    p = p.next;
                    slow = slow.next;
                }
                return p;
            }
        }
        return null;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* detectCycle(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
        if (slow == fast) {
            ListNode* p = head;
            while (p != slow) {
                p = p->next;
                slow = slow->next;
            }
            return p;
        }
    }
    return nullptr;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* detectCycle(struct Node* head) {
    struct Node* slow = head;
    struct Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
        if (slow == fast) {
            struct Node* p = head;
            while (p != slow) {
                p = p->next;
                slow = slow->next;
            }
            return p;
        }
    }
    return NULL;
}`
          }
        }
      ]
    },
    {
      id: 4,
      level: "beginner",
      q: "Merge Two Sorted Lists",
      ask: "Amazon · Microsoft · Apple · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/merge-two-sorted-lists/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/merge-two-sorted-linked-lists/1"}],
      a: "You get two lists sorted in non-decreasing order. Merge them into one sorted list by splicing the existing nodes.\n\n1 -> 2 -> 4 and 1 -> 3 -> 4 become 1 -> 1 -> 2 -> 3 -> 4 -> 4. Either input may be null.\n\nDumping all values, sorting, and rebuilding works but allocates. Recursion always takes the smaller head and merges the rest. The iterative dummy picks the smaller node in a loop.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O((n+m) log(n+m))",
          space: "O(n+m)",
          why: "Collect every value, sort the array, rebuild. Simple, but sort is extra work and you throw away the original nodes.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function mergeTwoLists(list1, list2) {
  const vals = [];
  for (let p = list1; p; p = p.next) vals.push(p.val);
  for (let p = list2; p; p = p.next) vals.push(p.val);
  vals.sort((a, b) => a - b);
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function mergeTwoLists(list1, list2) {
  const vals = [];
  for (let p = list1; p; p = p.next) vals.push(p.val);
  for (let p = list2; p; p = p.next) vals.push(p.val);
  vals.sort((a, b) => a - b);
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def mergeTwoLists(list1, list2):
    vals = []
    p = list1
    while p:
        vals.append(p.val)
        p = p.next
    p = list2
    while p:
        vals.append(p.val)
        p = p.next
    vals.sort()
    dummy = ListNode(0)
    tail = dummy
    for v in vals:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        List<Integer> vals = new ArrayList<>();
        ListNode p = list1;
        for (; p != null; p = p.next) {
            vals.add(p.val);
        }
        ListNode p = list2;
        for (; p != null; p = p.next) {
            vals.add(p.val);
        }
        Collections.sort(vals);
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (var v : vals) {
            tail.next = new ListNode(v);
            tail = tail.next;
        }
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    vector<int> vals;
    ListNode* p = list1;
    for (; p; p = p->next) {
        vals.push_back(p->val);
    }
    ListNode* p = list2;
    for (; p; p = p->next) {
        vals.push_back(p->val);
    }
    sort(vals.begin(), vals.end());
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    for (auto v : vals) {
        tail->next = new ListNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* mergeTwoLists(struct Node* list1, struct Node* list2) {
    int vals[10005]; int valsn = 0;
    struct Node* p = list1;
    for (; p; p = p->next) {
        vals[valsn++] = p->val;
    }
    struct Node* p = list2;
    for (; p; p = p->next) {
        vals[valsn++] = p->val;
    }
    qsort(vals, valsn, sizeof(int), cmpInt);
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    for (int _i = 0; _i < valsn; _i++) { int v = vals[_i];
        tail->next = newNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n+m)",
          space: "O(n+m)",
          why: "Recurse: the smaller head is the next output node, then merge the rest. Linear comparisons. Stack depth is O(n+m).",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function mergeTwoLists(list1, list2) {
  if (!list1) return list2;
  if (!list2) return list1;
  if (list1.val < list2.val) {
    list1.next = mergeTwoLists(list1.next, list2);
    return list1;
  }
  list2.next = mergeTwoLists(list1, list2.next);
  return list2;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function mergeTwoLists(list1, list2) {
  if (!list1) return list2;
  if (!list2) return list1;
  if (list1.val < list2.val) {
    list1.next = mergeTwoLists(list1.next, list2);
    return list1;
  }
  list2.next = mergeTwoLists(list1, list2.next);
  return list2;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def mergeTwoLists(list1, list2):
    if not list1:
        return list2
    if not list2:
        return list1
    if list1.val < list2.val:
        list1.next = mergeTwoLists(list1.next, list2)
        return list1
    list2.next = mergeTwoLists(list1, list2.next)
    return list2`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        if (list1 == null) {
            return list2;
        }
        if (list2 == null) {
            return list1;
        }
        if (list1.val < list2.val) {
            list1.next = mergeTwoLists(list1.next, list2);
            return list1;
        }
        list2.next = mergeTwoLists(list1, list2.next);
        return list2;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    if (!list1) {
        return list2;
    }
    if (!list2) {
        return list1;
    }
    if (list1->val < list2->val) {
        list1->next = mergeTwoLists(list1->next, list2);
        return list1;
    }
    list2->next = mergeTwoLists(list1, list2->next);
    return list2;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* mergeTwoLists(struct Node* list1, struct Node* list2) {
    if (!list1) {
        return list2;
    }
    if (!list2) {
        return list1;
    }
    if (list1->val < list2->val) {
        list1->next = mergeTwoLists(list1->next, list2);
        return list1;
    }
    list2->next = mergeTwoLists(list1, list2->next);
    return list2;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n+m)",
          space: "O(1)",
          why: "Dummy plus a tail pointer. Each step hangs the smaller remaining node. Leftover chain attaches at the end. Constant extra space besides the output, which reuses input nodes.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val < list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  tail.next = list1 || list2;
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (list1 && list2) {
    if (list1.val < list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }
  tail.next = list1 || list2;
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def mergeTwoLists(list1, list2):
    dummy = ListNode(0)
    tail = dummy
    while list1  and  list2:
        if list1.val < list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    tail.next = list1  or  list2
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (list1 != null && list2 != null) {
            if (list1.val < list2.val) {
                tail.next = list1;
                list1 = list1.next;
            }
            else {
                tail.next = list2;
                list2 = list2.next;
            }
            tail = tail.next;
        }
        tail.next = list1 || list2;
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    while (list1 && list2) {
        if (list1->val < list2->val) {
            tail->next = list1;
            list1 = list1->next;
        }
        else {
            tail->next = list2;
            list2 = list2->next;
        }
        tail = tail->next;
    }
    tail->next = list1 || list2;
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* mergeTwoLists(struct Node* list1, struct Node* list2) {
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    while (list1 && list2) {
        if (list1->val < list2->val) {
            tail->next = list1;
            list1 = list1->next;
        }
        else {
            tail->next = list2;
            list2 = list2->next;
        }
        tail = tail->next;
    }
    tail->next = list1 || list2;
    return dummy->next;
}`
          }
        }
      ]
    },
    {
      id: 5,
      level: "intermediate",
      q: "Remove Nth Node From End of List",
      ask: "Amazon · Google · Microsoft · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/remove-nth-node-from-end-of-list/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/remove-nth-node-from-end-of-the-list/1"}],
      a: "Delete the nth node counting from the tail. Return the new head.\n\nOn 1 -> 2 -> 3 -> 4 -> 5 with n = 2, drop 4 and return 1 -> 2 -> 3 -> 5. n can delete the original head.\n\nCopy nodes to an array and splice. Or count length, then walk length-n. The one-pass trick: dummy, send fast n+1 steps, walk both, then slow.next = slow.next.next.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Store every node in an array. Remove index length-n, then relink the remaining nodes in order. Extra array of pointers.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function removeNthFromEnd(head, n) {
  const nodes = [];
  let cur = head;
  while (cur) {
    nodes.push(cur);
    cur = cur.next;
  }
  nodes.splice(nodes.length - n, 1);
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const node of nodes) {
    tail.next = node;
    tail = tail.next;
  }
  tail.next = null;
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function removeNthFromEnd(head, n) {
  const nodes = [];
  let cur = head;
  while (cur) {
    nodes.push(cur);
    cur = cur.next;
  }
  nodes.splice(nodes.length - n, 1);
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const node of nodes) {
    tail.next = node;
    tail = tail.next;
  }
  tail.next = null;
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def removeNthFromEnd(head, n):
    nodes = []
    cur = head
    while cur:
        nodes.append(cur)
        cur = cur.next
    del nodes[len(nodes) - n]
    dummy = ListNode(0)
    tail = dummy
    for node in nodes:
        tail.next = node
        tail = tail.next
    tail.next = None
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        List<ListNode> nodes = new ArrayList<>();
        ListNode cur = head;
        while (cur != null) {
            nodes.add(cur);
            cur = cur.next;
        }
        nodes.splice(nodes.size() - n, 1);
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (var node : nodes) {
            tail.next = node;
            tail = tail.next;
        }
        tail.next = null;
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* removeNthFromEnd(ListNode* head, int n) {
    vector<ListNode*> nodes;
    ListNode* cur = head;
    while (cur) {
        nodes.push_back(cur);
        cur = cur->next;
    }
    nodes.splice(nodes.size() - n, 1);
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    for (auto node : nodes) {
        tail->next = node;
        tail = tail->next;
    }
    tail->next = nullptr;
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* removeNthFromEnd(struct Node* head, int n) {
    struct Node* nodes[10005]; int nodesn = 0;
    struct Node* cur = head;
    while (cur) {
        nodes[nodesn++] = cur;
        cur = cur->next;
    }
    nodes.splice(nodesn - n, 1);
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    for (int _i = 0; _i < nodesn; _i++) { struct Node* node = nodes[_i];
        tail->next = node;
        tail = tail->next;
    }
    tail->next = NULL;
    return dummy->next;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Recursive walk to the end, counting on the way back. When the counter hits n, skip that node from the parent. Stack is O(n).",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function removeNthFromEnd(head, n) {
  function go(node) {
    if (!node) return 0;
    const fromEnd = go(node.next) + 1;
    if (fromEnd === n + 1) node.next = node.next.next;
    return fromEnd;
  }
  const dummy = new ListNode(0, head);
  go(dummy);
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function removeNthFromEnd(head, n) {
  function go(node) {
    if (!node) return 0;
    const fromEnd = go(node.next) + 1;
    if (fromEnd === n + 1) node.next = node.next.next;
    return fromEnd;
  }
  const dummy = new ListNode(0, head);
  go(dummy);
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def removeNthFromEnd(head, n):
    def go(node):
        if not node:
            return 0
        fromEnd = go(node.next) + 1
        if fromEnd == n + 1:
            node.next = node.next.next
        return fromEnd
    dummy = ListNode(0, head)
    go(dummy)
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    private ListNode removeNthFromEnd_go(ListNode node) {
        if (node == null) {
            return 0;
        }
        ListNode fromEnd = removeNthFromEnd_go(node.next) + 1;
        if (fromEnd == n + 1) {
            node.next = node.next.next;
        }
        return fromEnd;
    }

    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        removeNthFromEnd_go(dummy);
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* removeNthFromEnd_go(ListNode* node) {
    if (!node) {
        return 0;
    }
    ListNode* fromEnd = removeNthFromEnd_go(node->next) + 1;
    if (fromEnd == n + 1) {
        node->next = node->next.next;
    }
    return fromEnd;
}

ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode* dummy = new ListNode(0, head);
    removeNthFromEnd_go(dummy);
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* removeNthFromEnd_go(struct Node* node) {
    if (!node) {
        return 0;
    }
    struct Node* fromEnd = removeNthFromEnd_go(node->next) + 1;
    if (fromEnd == n + 1) {
        node->next = node->next.next;
    }
    return fromEnd;
}

struct Node* removeNthFromEnd(struct Node* head, int n) {
    struct Node* dummy = newNode(0, head);
    removeNthFromEnd_go(dummy);
    return dummy->next;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Dummy head. Fast walks n+1 steps so the gap is n nodes. Then slow and fast move together. When fast is null, slow sits before the victim. Unlink and return dummy.next. One pass, constant extra space.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i < n + 1; i++) fast = fast.next;
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head);
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i < n + 1; i++) fast = fast.next;
  while (fast) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def removeNthFromEnd(head, n):
    dummy = ListNode(0, head)
    fast = dummy
    slow = dummy
    for i in range(n + 1):
        fast = fast.next
    while fast:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode dummy = new ListNode(0, head);
        ListNode fast = dummy;
        ListNode slow = dummy;
        for (int i = 0; i < n + 1; i++) {
            fast = fast.next;
        }
        while (fast != null) {
            fast = fast.next;
            slow = slow.next;
        }
        slow.next = slow.next.next;
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode* dummy = new ListNode(0, head);
    ListNode* fast = dummy;
    ListNode* slow = dummy;
    for (int i = 0; i < n + 1; i++) {
        fast = fast->next;
    }
    while (fast) {
        fast = fast->next;
        slow = slow->next;
    }
    slow->next = slow->next.next;
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* removeNthFromEnd(struct Node* head, int n) {
    struct Node* dummy = newNode(0, head);
    struct Node* fast = dummy;
    struct Node* slow = dummy;
    for (int i = 0; i < n + 1; i++) {
        fast = fast->next;
    }
    while (fast) {
        fast = fast->next;
        slow = slow->next;
    }
    slow->next = slow->next.next;
    return dummy->next;
}`
          }
        }
      ]
    },
    {
      id: 6,
      level: "beginner",
      q: "Palindrome Linked List",
      ask: "Amazon · Microsoft · Apple · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/palindrome-linked-list/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/check-if-linked-list-is-pallindrome/1"}],
      a: "Return true if the list reads the same forward and backward.\n\n1 -> 2 -> 2 -> 1 is a palindrome. 1 -> 2 is not. Values compare; you may reverse half of the list in place if you restore or the caller allows mutation.\n\nCopy values to an array and two-pointer check. Recursion compares the front on the way back. The linear extra-space-free way: find mid, reverse the second half, compare, optionally restore.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Dump values into an array. Check index i against length-1-i. Extra memory is the array.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function isPalindrome(head) {
  const vals = [];
  let cur = head;
  while (cur) {
    vals.push(cur.val);
    cur = cur.next;
  }
  let i = 0;
  let j = vals.length - 1;
  while (i < j) {
    if (vals[i] !== vals[j]) return false;
    i++;
    j--;
  }
  return true;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function isPalindrome(head) {
  const vals = [];
  let cur = head;
  while (cur) {
    vals.push(cur.val);
    cur = cur.next;
  }
  let i = 0;
  let j = vals.length - 1;
  while (i < j) {
    if (vals[i] !== vals[j]) return false;
    i++;
    j--;
  }
  return true;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def isPalindrome(head):
    vals = []
    cur = head
    while cur:
        vals.append(cur.val)
        cur = cur.next
    i = 0
    j = len(vals) - 1
    while i < j:
        if vals[i] != vals[j]:
            return False
        i += 1
        j -= 1
    return True`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public boolean isPalindrome(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        ListNode cur = head;
        while (cur != null) {
            vals.add(cur.val);
            cur = cur.next;
        }
        int i = 0;
        int j = vals.size() - 1;
        while (i < j) {
            if (vals[i] != vals[j]) {
                return false;
            }
            i++;
            j--;
        }
        return true;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

bool isPalindrome(ListNode* head) {
    vector<int> vals;
    ListNode* cur = head;
    while (cur) {
        vals.push_back(cur->val);
        cur = cur->next;
    }
    int i = 0;
    int j = vals.size() - 1;
    while (i < j) {
        if (vals[i] != vals[j]) {
            return false;
        }
        i++;
        j--;
    }
    return true;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isPalindrome(struct Node* head) {
    int vals[10005]; int valsn = 0;
    struct Node* cur = head;
    while (cur) {
        vals[valsn++] = cur->val;
        cur = cur->next;
    }
    int i = 0;
    int j = valsn - 1;
    while (i < j) {
        if (vals[i] != vals[j]) {
            return false;
        }
        i++;
        j--;
    }
    return true;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Recurse to the tail. A shared front pointer walks forward as the stack walks back. First mismatch fails. Stack is O(n).",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function isPalindrome(head) {
  const box = { front: head, ok: true };
  function go(node) {
    if (!node) return;
    go(node.next);
    if (node.val !== box.front.val) box.ok = false;
    box.front = box.front.next;
  }
  go(head);
  return box.ok;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function isPalindrome(head) {
  const box = { front: head, ok: true };
  function go(node) {
    if (!node) return;
    go(node.next);
    if (node.val !== box.front.val) box.ok = false;
    box.front = box.front.next;
  }
  go(head);
  return box.ok;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def isPalindrome(head):
    box = {"front": head, "ok": True}
    def go(node):
        if not node:
            return
        go(node.next)
        if node.val != box["front"].val:
            box["ok"] = False
        box["front"] = box["front"].next
    go(head)
    return box["ok"]`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    private boolean isPalindrome_go(ListNode node) {
        if (node == null) {
            return;
        }
        isPalindrome_go(node.next);
        if (node.val != box.front.val) {
            box_ok = false;
        }
        box_front = box_front.next;
    }

    public boolean isPalindrome(ListNode head) {
        ListNode box_front = head;
        boolean box_ok = true;
        isPalindrome_go(head);
        return box.ok;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

bool isPalindrome_go(ListNode* node) {
    if (!node) {
        return;
    }
    isPalindrome_go(node->next);
    if (node->val != box.front->val) {
        box_ok = false;
    }
    box_front = box_front->next;
}

bool isPalindrome(ListNode* head) {
    ListNode* box_front = head;
    bool box_ok = true;
    isPalindrome_go(head);
    return box.ok;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isPalindrome_go(struct Node* node) {
    if (!node) {
        return;
    }
    isPalindrome_go(node->next);
    if (node->val != box.front->val) {
        box_ok = false;
    }
    box_front = box_front->next;
}

bool isPalindrome(struct Node* head) {
    struct Node* box_front = head;
    bool box_ok = true;
    isPalindrome_go(head);
    return box.ok;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Slow/fast to the mid, reverse the second half, compare first half with reversed half. Only a few pointers. Mutates the list; reverse again if you must restore.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function isPalindrome(head) {
  if (!head || !head.next) return true;
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let prev = null;
  let cur = slow;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  let a = head;
  let b = prev;
  while (b) {
    if (a.val !== b.val) return false;
    a = a.next;
    b = b.next;
  }
  return true;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function isPalindrome(head) {
  if (!head || !head.next) return true;
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  let prev = null;
  let cur = slow;
  while (cur) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  let a = head;
  let b = prev;
  while (b) {
    if (a.val !== b.val) return false;
    a = a.next;
    b = b.next;
  }
  return true;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def isPalindrome(head):
    if not head  or  not head.next:
        return True
    slow = head
    fast = head
    while fast  and  fast.next:
        slow = slow.next
        fast = fast.next.next
    prev = None
    cur = slow
    while cur:
        next = cur.next
        cur.next = prev
        prev = cur
        cur = next
    a = head
    b = prev
    while b:
        if a.val != b.val:
            return False
        a = a.next
        b = b.next
    return True`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public boolean isPalindrome(ListNode head) {
        if (head == null || head.next == null) {
            return true;
        }
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode prev = null;
        ListNode cur = slow;
        while (cur != null) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        ListNode a = head;
        ListNode b = prev;
        while (b != null) {
            if (a.val != b.val) {
                return false;
            }
            a = a.next;
            b = b.next;
        }
        return true;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

bool isPalindrome(ListNode* head) {
    if (!head || !head->next) {
        return true;
    }
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
    }
    ListNode* prev = nullptr;
    ListNode* cur = slow;
    while (cur) {
        ListNode* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    ListNode* a = head;
    ListNode* b = prev;
    while (b) {
        if (a->val != b->val) {
            return false;
        }
        a = a->next;
        b = b->next;
    }
    return true;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

bool isPalindrome(struct Node* head) {
    if (!head || !head->next) {
        return true;
    }
    struct Node* slow = head;
    struct Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
    }
    struct Node* prev = NULL;
    struct Node* cur = slow;
    while (cur) {
        struct Node* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    struct Node* a = head;
    struct Node* b = prev;
    while (b) {
        if (a->val != b->val) {
            return false;
        }
        a = a->next;
        b = b->next;
    }
    return true;
}`
          }
        }
      ]
    },
    {
      id: 7,
      level: "beginner",
      q: "Middle of the Linked List",
      ask: "Amazon · Google · Apple · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/middle-of-the-linked-list/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/finding-middle-element-in-a-linked-list/1"}],
      a: "Return the middle node. If there are two middles, return the second one.\n\nOn 1 -> 2 -> 3 -> 4 -> 5 the middle is 3. On 1 -> 2 -> 3 -> 4 -> 5 -> 6 the middle is 4.\n\nStore nodes in an array and pick index floor(length/2). Recursion can move slow and fast down the chain. Iterative slow/fast is the usual one-pass answer.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Push every node into an array, then return the node at floor(length/2). Extra array of pointers.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function middleNode(head) {
  const nodes = [];
  let cur = head;
  while (cur) {
    nodes.push(cur);
    cur = cur.next;
  }
  return nodes[Math.floor(nodes.length / 2)];
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function middleNode(head) {
  const nodes = [];
  let cur = head;
  while (cur) {
    nodes.push(cur);
    cur = cur.next;
  }
  return nodes[Math.floor(nodes.length / 2)];
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def middleNode(head):
    nodes = []
    cur = head
    while cur:
        nodes.append(cur)
        cur = cur.next
    return nodes[(len(nodes) / 2)]`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode middleNode(ListNode head) {
        List<ListNode> nodes = new ArrayList<>();
        ListNode cur = head;
        while (cur != null) {
            nodes.add(cur);
            cur = cur.next;
        }
        return nodes[(nodes.size() / 2)];
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* middleNode(ListNode* head) {
    vector<ListNode*> nodes;
    ListNode* cur = head;
    while (cur) {
        nodes.push_back(cur);
        cur = cur->next;
    }
    return nodes[(nodes.size() / 2]];
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* middleNode(struct Node* head) {
    struct Node* nodes[10005]; int nodesn = 0;
    struct Node* cur = head;
    while (cur) {
        nodes[nodesn++] = cur;
        cur = cur->next;
    }
    return nodes[(nodesn / 2]];
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Recursive slow/fast: if fast cannot take two steps, slow is the middle. Stack depth is O(n).",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function middleNode(head) {
  function walk(slow, fast) {
    if (!fast || !fast.next) return slow;
    return walk(slow.next, fast.next.next);
  }
  return walk(head, head);
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function middleNode(head) {
  function walk(slow, fast) {
    if (!fast || !fast.next) return slow;
    return walk(slow.next, fast.next.next);
  }
  return walk(head, head);
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def middleNode(head):
    def walk(slow, fast):
        if not fast  or  not fast.next:
            return slow
        return walk(slow.next, fast.next.next)
    return walk(head, head)`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    private ListNode middleNode_walk(int slow, int fast) {
        if (fast == null || fast.next == null) {
            return slow;
        }
        return middleNode_walk(slow.next, fast.next.next);
    }

    public ListNode middleNode(ListNode head) {
        return middleNode_walk(head, head);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* middleNode_walk(int slow, int fast) {
    if (!fast || !fast->next) {
        return slow;
    }
    return middleNode_walk(slow->next, fast->next.next);
}

ListNode* middleNode(ListNode* head) {
    return middleNode_walk(head, head);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* middleNode_walk(int slow, int fast) {
    if (!fast || !fast->next) {
        return slow;
    }
    return middleNode_walk(slow->next, fast->next.next);
}

struct Node* middleNode(struct Node* head) {
    return middleNode_walk(head, head);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Iterative tortoise and hare. When fast falls off, slow is the second middle on even length. Constant extra space.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function middleNode(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function middleNode(head) {
  let slow = head;
  let fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def middleNode(head):
    slow = head
    fast = head
    while fast  and  fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode middleNode(ListNode head) {
        ListNode slow = head;
        ListNode fast = head;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        return slow;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* middleNode(ListNode* head) {
    ListNode* slow = head;
    ListNode* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
    }
    return slow;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* middleNode(struct Node* head) {
    struct Node* slow = head;
    struct Node* fast = head;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
    }
    return slow;
}`
          }
        }
      ]
    },
    {
      id: 8,
      level: "intermediate",
      q: "Intersection of Two Linked Lists",
      ask: "Amazon · Microsoft · Apple · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/intersection-of-two-linked-lists/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/intersection-point-in-y-shapped-linked-lists/1"}],
      a: "Lists A and B may share a suffix (same node objects from some point). Return the first common node, or null if they never join.\n\nA: 4 -> 1 -> 8 -> 4 -> 5 and B: 5 -> 6 -> 1 -> 8 -> 4 -> 5 intersect at the node 8. Compare references, not values.\n\nNested walks check every pair. A Set of A's nodes then a walk of B is linear extra space. Two pointers that swap lists after the end equalize remaining length and meet at the join.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n·m)",
          space: "O(1)",
          why: "For each node in A, walk all of B looking for the same object. No extra set. Quadratic time.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function getIntersectionNode(headA, headB) {
  let a = headA;
  while (a) {
    let b = headB;
    while (b) {
      if (a === b) return a;
      b = b.next;
    }
    a = a.next;
  }
  return null;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function getIntersectionNode(headA, headB) {
  let a = headA;
  while (a) {
    let b = headB;
    while (b) {
      if (a === b) return a;
      b = b.next;
    }
    a = a.next;
  }
  return null;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def getIntersectionNode(headA, headB):
    a = headA
    while a:
        b = headB
        while b:
            if a == b:
                return a
            b = b.next
        a = a.next
    return None`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode a = headA;
        while (a != null) {
            ListNode b = headB;
            while (b != null) {
                if (a == b) {
                    return a;
                }
                b = b.next;
            }
            a = a.next;
        }
        return null;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
    ListNode* a = headA;
    while (a) {
        ListNode* b = headB;
        while (b) {
            if (a == b) {
                return a;
            }
            b = b->next;
        }
        a = a->next;
    }
    return nullptr;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* getIntersectionNode(struct Node* headA, struct Node* headB) {
    struct Node* a = headA;
    while (a) {
        struct Node* b = headB;
        while (b) {
            if (a == b) {
                return a;
            }
            b = b->next;
        }
        a = a->next;
    }
    return NULL;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n+m)",
          space: "O(n)",
          why: "Put every node of A in a Set. Walk B; the first node in the set is the intersection. Linear time, extra memory for A.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function getIntersectionNode(headA, headB) {
  const seen = new Set();
  let a = headA;
  while (a) {
    seen.add(a);
    a = a.next;
  }
  let b = headB;
  while (b) {
    if (seen.has(b)) return b;
    b = b.next;
  }
  return null;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function getIntersectionNode(headA, headB) {
  const seen = new Set();
  let a = headA;
  while (a) {
    seen.add(a);
    a = a.next;
  }
  let b = headB;
  while (b) {
    if (seen.has(b)) return b;
    b = b.next;
  }
  return null;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def getIntersectionNode(headA, headB):
    seen = set()
    a = headA
    while a:
        seen.add(a)
        a = a.next
    b = headB
    while b:
        if (b in seen):
            return b
        b = b.next
    return None`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        Set<ListNode> seen = new HashSet<>();
        ListNode a = headA;
        while (a != null) {
            seen.add(a);
            a = a.next;
        }
        ListNode b = headB;
        while (b != null) {
            if (seen.contains(b)) {
                return b;
            }
            b = b.next;
        }
        return null;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
    unordered_set<ListNode*> seen;
    ListNode* a = headA;
    while (a) {
        seen.insert(a);
        a = a->next;
    }
    ListNode* b = headB;
    while (b) {
        if (seen.count(b)) {
            return b;
        }
        b = b->next;
    }
    return nullptr;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* getIntersectionNode(struct Node* headA, struct Node* headB) {
    struct Node* seen[10005]; int seenn = 0;
    struct Node* a = headA;
    while (a) {
        seen[seenn++] = a;
        a = a->next;
    }
    struct Node* b = headB;
    while (b) {
        if (containsPtr(seen, seenn, b)) {
            return b;
        }
        b = b->next;
    }
    return NULL;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n+m)",
          space: "O(1)",
          why: "Pointer a walks A then B. Pointer b walks B then A. They travel the same total length and meet at the first shared node, or both hit null. No set.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function getIntersectionNode(headA, headB) {
  let a = headA;
  let b = headB;
  while (a !== b) {
    a = a ? a.next : headB;
    b = b ? b.next : headA;
  }
  return a;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function getIntersectionNode(headA, headB) {
  let a = headA;
  let b = headB;
  while (a !== b) {
    a = a ? a.next : headB;
    b = b ? b.next : headA;
  }
  return a;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def getIntersectionNode(headA, headB):
    a = headA
    b = headB
    while a != b:
        a = (a.next if a else headB)
        b = (b.next if b else headA)
    return a`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        ListNode a = headA;
        ListNode b = headB;
        while (a != b) {
            a = a ? a.next : headB;
            b = b ? b.next : headA;
        }
        return a;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
    ListNode* a = headA;
    ListNode* b = headB;
    while (a != b) {
        a = a ? a->next : headB;
        b = b ? b->next : headA;
    }
    return a;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* getIntersectionNode(struct Node* headA, struct Node* headB) {
    struct Node* a = headA;
    struct Node* b = headB;
    while (a != b) {
        a = a ? a->next : headB;
        b = b ? b->next : headA;
    }
    return a;
}`
          }
        }
      ]
    },
    {
      id: 9,
      level: "intermediate",
      q: "Add Two Numbers",
      ask: "Amazon · Microsoft · Google · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/add-two-numbers/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/add-two-numbers-represented-by-linked-lists/1"}],
      a: "Two lists store digits of two numbers in reverse order, one digit per node. Return their sum as a list in the same format. A leftover carry can create an extra node.\n\n2 -> 4 -> 3 plus 5 -> 6 -> 4 is 342 + 465 = 807, so 7 -> 0 -> 8.\n\nBigInt from the digits works until you remember interviews want digit-by-digit carry. Recursion adds a pair plus carry. Iteration with a dummy is the usual write-up.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n+m)",
          space: "O(n+m)",
          why: "Turn each list into a BigInt (least-significant digit first), add, then emit digits into a new list. Easy in JavaScript, hides the carry logic interviewers want.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function addTwoNumbers(l1, l2) {
  function toBig(node) {
    let n = 0n;
    let place = 1n;
    while (node) {
      n += BigInt(node.val) * place;
      place *= 10n;
      node = node.next;
    }
    return n;
  }
  let sum = toBig(l1) + toBig(l2);
  const dummy = new ListNode(0);
  let tail = dummy;
  if (sum === 0n) return dummy;
  while (sum > 0n) {
    tail.next = new ListNode(Number(sum % 10n));
    tail = tail.next;
    sum /= 10n;
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function addTwoNumbers(l1, l2) {
  function toBig(node) {
    let n = 0n;
    let place = 1n;
    while (node) {
      n += BigInt(node.val) * place;
      place *= 10n;
      node = node.next;
    }
    return n;
  }
  let sum = toBig(l1) + toBig(l2);
  const dummy = new ListNode(0);
  let tail = dummy;
  if (sum === 0n) return dummy;
  while (sum > 0n) {
    tail.next = new ListNode(Number(sum % 10n));
    tail = tail.next;
    sum /= 10n;
  }
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def addTwoNumbers(l1, l2):
    def toBig(node):
        n = 0
        place = 1
        while node:
            n += node.val * place
            place *= 10
            node = node.next
        return n
    sum = toBig(l1) + toBig(l2)
    dummy = ListNode(0)
    tail = dummy
    if sum == 0:
        return dummy
    while sum > 0:
        tail.next = ListNode(int(sum % 10))
        tail = tail.next
        sum /= 10
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    private int addTwoNumbers_toBig(ListNode node) {
        int n = 0L;
        int place = 1L;
        while (node != null) {
            n += node.val * place;
            place *= 10L;
            node = node.next;
        }
        return n;
    }

    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        int sum = addTwoNumbers_toBig(l1) + addTwoNumbers_toBig(l2);
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        if (sum == 0L) {
            return dummy;
        }
        while (sum > 0L) {
            tail.next = new ListNode(Integer.parseInt(sum % 10L));
            tail = tail.next;
            sum /= 10L;
        }
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

int addTwoNumbers_toBig(ListNode* node) {
    int n = 0;
    int place = 1;
    while (node) {
        n += node->val * place;
        place *= 10;
        node = node->next;
    }
    return n;
}

ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    int sum = addTwoNumbers_toBig(l1) + addTwoNumbers_toBig(l2);
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    if (sum == 0) {
        return dummy;
    }
    while (sum > 0) {
        tail->next = new ListNode(stoi(sum % 10));
        tail = tail->next;
        sum /= 10;
    }
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int addTwoNumbers_toBig(struct Node* node) {
    int n = 0;
    int place = 1;
    while (node) {
        n += node->val * place;
        place *= 10;
        node = node->next;
    }
    return n;
}

struct Node* addTwoNumbers(struct Node* l1, struct Node* l2) {
    int sum = addTwoNumbers_toBig(l1) + addTwoNumbers_toBig(l2);
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    if (sum == 0) {
        return dummy;
    }
    while (sum > 0) {
        tail->next = newNode(atoi(sum % 10));
        tail = tail->next;
        sum /= 10;
    }
    return dummy->next;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(max(n,m))",
          space: "O(max(n,m))",
          why: "Recursive add of two nodes plus carry. Next call gets the rest of both lists. Stack depth follows the longer number.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function addTwoNumbers(l1, l2) {
  function add(a, b, carry) {
    if (!a && !b && carry === 0) return null;
    const sum = (a ? a.val : 0) + (b ? b.val : 0) + carry;
    const node = new ListNode(sum % 10);
    node.next = add(a ? a.next : null, b ? b.next : null, Math.floor(sum / 10));
    return node;
  }
  return add(l1, l2, 0);
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function addTwoNumbers(l1, l2) {
  function add(a, b, carry) {
    if (!a && !b && carry === 0) return null;
    const sum = (a ? a.val : 0) + (b ? b.val : 0) + carry;
    const node = new ListNode(sum % 10);
    node.next = add(a ? a.next : null, b ? b.next : null, Math.floor(sum / 10));
    return node;
  }
  return add(l1, l2, 0);
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def addTwoNumbers(l1, l2):
    def add(a, b, carry):
        if not a  and  not b  and  carry == 0:
            return None
        sum = (a ? a.val : 0) + (b ? b.val : 0) + carry
        node = ListNode(sum % 10)
        node.next = add(a ? a.next : None, b ? b.next : None, (sum  # 10))
        return node
    return add(l1, l2, 0)`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    private ListNode addTwoNumbers_add(ListNode a, ListNode b, int carry) {
        if (a == null && b == null && carry == 0) {
            return null;
        }
        int sum = (a ? a.val : 0) + (b ? b.val : 0) + carry;
        ListNode node = new ListNode(sum % 10);
        node.next = addTwoNumbers_add(a ? a.next : null, b ? b.next : null, (sum / 10));
        return node;
    }

    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        return addTwoNumbers_add(l1, l2, 0);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* addTwoNumbers_add(ListNode* a, ListNode* b, int carry) {
    if (!a && !b && carry == 0) {
        return nullptr;
    }
    int sum = (a ? a->val : 0) + (b ? b->val : 0) + carry;
    ListNode* node = new ListNode(sum % 10);
    node->next = addTwoNumbers_add(a ? a->next : nullptr, b ? b->next : nullptr, (sum / 10));
    return node;
}

ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    return addTwoNumbers_add(l1, l2, 0);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* addTwoNumbers_add(struct Node* a, struct Node* b, int carry) {
    if (!a && !b && carry == 0) {
        return NULL;
    }
    int sum = (a ? a->val : 0) + (b ? b->val : 0) + carry;
    struct Node* node = newNode(sum % 10);
    node->next = addTwoNumbers_add(a ? a->next : NULL, b ? b->next : NULL, (sum / 10));
    return node;
}

struct Node* addTwoNumbers(struct Node* l1, struct Node* l2) {
    return addTwoNumbers_add(l1, l2, 0);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(max(n,m))",
          space: "O(1)",
          why: "Iterative dummy. Each step sums two digits and carry, writes sum % 10, carry becomes floor(sum/10). Extra node if carry remains. Output list is required; extra pointers are constant.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  let carry = 0;
  while (l1 || l2 || carry) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    carry = Math.floor(sum / 10);
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(0);
  let tail = dummy;
  let carry = 0;
  while (l1 || l2 || carry) {
    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    carry = Math.floor(sum / 10);
    if (l1) l1 = l1.next;
    if (l2) l2 = l2.next;
  }
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    carry = 0
    while l1  or  l2  or  carry:
        sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry
        tail.next = ListNode(sum % 10)
        tail = tail.next
        carry = (sum  # 10)
        if l1:
            l1 = l1.next
        if l2:
            l2 = l2.next
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        int carry = 0;
        while (l1 != null || l2 != null || carry) {
            int sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;
            tail.next = new ListNode(sum % 10);
            tail = tail.next;
            carry = (sum / 10);
            if (l1 != null) {
                l1 = l1.next;
            }
            if (l2 != null) {
                l2 = l2.next;
            }
        }
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    int carry = 0;
    while (l1 || l2 || carry) {
        int sum = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;
        tail->next = new ListNode(sum % 10);
        tail = tail->next;
        carry = (sum / 10);
        if (l1) {
            l1 = l1->next;
        }
        if (l2) {
            l2 = l2->next;
        }
    }
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* addTwoNumbers(struct Node* l1, struct Node* l2) {
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    int carry = 0;
    while (l1 || l2 || carry) {
        int sum = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;
        tail->next = newNode(sum % 10);
        tail = tail->next;
        carry = (sum / 10);
        if (l1) {
            l1 = l1->next;
        }
        if (l2) {
            l2 = l2->next;
        }
    }
    return dummy->next;
}`
          }
        }
      ]
    },
    {
      id: 10,
      level: "advanced",
      q: "Reverse Nodes in k-Group",
      ask: "Amazon · Microsoft · Google · Meta",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/reverse-nodes-in-k-group/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/reverse-a-linked-list-in-groups-of-given-size/1"}],
      a: "Reverse nodes in groups of k. If the last chunk has fewer than k nodes, leave it as is. Reverse the nodes themselves, not only the values.\n\n1 -> 2 -> 3 -> 4 -> 5 with k = 2 becomes 2 -> 1 -> 4 -> 3 -> 5. With k = 3 it becomes 3 -> 2 -> 1 -> 4 -> 5.\n\nArray reverse of each full window is the brute. Recursion reverses the first k then attaches reverseKGroup of the rest. Iteration walks group by group with a dummy.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Copy values, reverse each complete window of k in the array, rebuild a new list. Extra array and new nodes.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseKGroup(head, k) {
  const vals = [];
  for (let p = head; p; p = p.next) vals.push(p.val);
  for (let i = 0; i + k <= vals.length; i += k) {
    let l = i;
    let r = i + k - 1;
    while (l < r) {
      const t = vals[l];
      vals[l] = vals[r];
      vals[r] = t;
      l++;
      r--;
    }
  }
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseKGroup(head, k) {
  const vals = [];
  for (let p = head; p; p = p.next) vals.push(p.val);
  for (let i = 0; i + k <= vals.length; i += k) {
    let l = i;
    let r = i + k - 1;
    while (l < r) {
      const t = vals[l];
      vals[l] = vals[r];
      vals[r] = t;
      l++;
      r--;
    }
  }
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def reverseKGroup(head, k):
    vals = []
    p = head
    while p:
        vals.append(p.val)
        p = p.next
    i = 0
    while i + k <= len(vals):
        l = i
        r = i + k - 1
        while l < r:
            t = vals[l]
            vals[l] = vals[r]
            vals[r] = t
            l += 1
            r -= 1
        i += k
    dummy = ListNode(0)
    tail = dummy
    for v in vals:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        List<Integer> vals = new ArrayList<>();
        ListNode p = head;
        for (; p != null; p = p.next) {
            vals.add(p.val);
        }
        for (int i = 0; i + k <= vals.size(); i += k) {
            int l = i;
            int r = i + k - 1;
            while (l < r) {
                int t = vals[l];
                vals[l] = vals[r];
                vals[r] = t;
                l++;
                r--;
            }
        }
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (var v : vals) {
            tail.next = new ListNode(v);
            tail = tail.next;
        }
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* reverseKGroup(ListNode* head, int k) {
    vector<int> vals;
    ListNode* p = head;
    for (; p; p = p->next) {
        vals.push_back(p->val);
    }
    for (int i = 0; i + k <= vals.size(); i += k) {
        int l = i;
        int r = i + k - 1;
        while (l < r) {
            int t = vals[l];
            vals[l] = vals[r];
            vals[r] = t;
            l++;
            r--;
        }
    }
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    for (auto v : vals) {
        tail->next = new ListNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* reverseKGroup(struct Node* head, int k) {
    int vals[10005]; int valsn = 0;
    struct Node* p = head;
    for (; p; p = p->next) {
        vals[valsn++] = p->val;
    }
    for (int i = 0; i + k <= valsn; i += k) {
        int l = i;
        int r = i + k - 1;
        while (l < r) {
            int t = vals[l];
            vals[l] = vals[r];
            vals[r] = t;
            l++;
            r--;
        }
    }
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    for (int _i = 0; _i < valsn; _i++) { int v = vals[_i];
        tail->next = newNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n/k)",
          why: "If fewer than k nodes remain, return head. Else reverse the first k, then set the old head's next to reverseKGroup of the leftover. Recursion depth is number of groups.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseKGroup(head, k) {
  let n = 0;
  let p = head;
  while (p && n < k) {
    p = p.next;
    n++;
  }
  if (n < k) return head;
  let prev = null;
  let cur = head;
  for (let i = 0; i < k; i++) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  head.next = reverseKGroup(cur, k);
  return prev;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseKGroup(head, k) {
  let n = 0;
  let p = head;
  while (p && n < k) {
    p = p.next;
    n++;
  }
  if (n < k) return head;
  let prev = null;
  let cur = head;
  for (let i = 0; i < k; i++) {
    const next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  head.next = reverseKGroup(cur, k);
  return prev;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def reverseKGroup(head, k):
    n = 0
    p = head
    while p  and  n < k:
        p = p.next
        n += 1
    if n < k:
        return head
    prev = None
    cur = head
    for i in range(k):
        next = cur.next
        cur.next = prev
        prev = cur
        cur = next
    head.next = reverseKGroup(cur, k)
    return prev`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode reverseKGroup(ListNode head, int k) {
        int n = 0;
        ListNode p = head;
        while (p != null && n < k) {
            p = p.next;
            n++;
        }
        if (n < k) {
            return head;
        }
        ListNode prev = null;
        ListNode cur = head;
        for (int i = 0; i < k; i++) {
            ListNode next = cur.next;
            cur.next = prev;
            prev = cur;
            cur = next;
        }
        head.next = reverseKGroup(cur, k);
        return prev;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* reverseKGroup(ListNode* head, int k) {
    int n = 0;
    ListNode* p = head;
    while (p && n < k) {
        p = p->next;
        n++;
    }
    if (n < k) {
        return head;
    }
    ListNode* prev = nullptr;
    ListNode* cur = head;
    for (int i = 0; i < k; i++) {
        ListNode* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    head->next = reverseKGroup(cur, k);
    return prev;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* reverseKGroup(struct Node* head, int k) {
    int n = 0;
    struct Node* p = head;
    while (p && n < k) {
        p = p->next;
        n++;
    }
    if (n < k) {
        return head;
    }
    struct Node* prev = NULL;
    struct Node* cur = head;
    for (int i = 0; i < k; i++) {
        struct Node* next = cur->next;
        cur->next = prev;
        prev = cur;
        cur = next;
    }
    head->next = reverseKGroup(cur, k);
    return prev;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Dummy before head. For each group, reverse k nodes between groupPrev and groupNext, then slide groupPrev. No recursion. Constant extra pointers.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseKGroup(head, k) {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy;

  function kth(start, k) {
    let n = start;
    for (let i = 0; i < k; i++) {
      if (!n) return null;
      n = n.next;
    }
    return n;
  }

  while (true) {
    const groupLast = kth(groupPrev, k);
    if (!groupLast) break;
    const groupNext = groupLast.next;
    let prev = groupNext;
    let cur = groupPrev.next;
    while (cur !== groupNext) {
      const next = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
    }
    const newGroupStart = groupPrev.next;
    groupPrev.next = groupLast;
    groupPrev = newGroupStart;
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function reverseKGroup(head, k) {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy;

  function kth(start, k) {
    let n = start;
    for (let i = 0; i < k; i++) {
      if (!n) return null;
      n = n.next;
    }
    return n;
  }

  while (true) {
    const groupLast = kth(groupPrev, k);
    if (!groupLast) break;
    const groupNext = groupLast.next;
    let prev = groupNext;
    let cur = groupPrev.next;
    while (cur !== groupNext) {
      const next = cur.next;
      cur.next = prev;
      prev = cur;
      cur = next;
    }
    const newGroupStart = groupPrev.next;
    groupPrev.next = groupLast;
    groupPrev = newGroupStart;
  }
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def reverseKGroup(head, k):
    dummy = ListNode(0, head)
    groupPrev = dummy
    def kth(start, k):
        n = start
        for i in range(k):
            if not n:
                return None
            n = n.next
        return n
    while True:
        groupLast = kth(groupPrev, k)
        if not groupLast:
            break
        groupNext = groupLast.next
        prev = groupNext
        cur = groupPrev.next
        while cur != groupNext:
            next = cur.next
            cur.next = prev
            prev = cur
            cur = next
        newGroupStart = groupPrev.next
        groupPrev.next = groupLast
        groupPrev = newGroupStart
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    private ListNode reverseKGroup_kth(ListNode start, int k) {
        ListNode n = start;
        for (int i = 0; i < k; i++) {
            if (!n) {
                return null;
            }
            n = n.next;
        }
        return n;
    }

    public ListNode reverseKGroup(ListNode head, int k) {
        ListNode dummy = new ListNode(0, head);
        ListNode groupPrev = dummy;
        while (true) {
            ListNode groupLast = reverseKGroup_kth(groupPrev, k);
            if (groupLast == null) {
                break;
            }
            ListNode groupNext = groupLast.next;
            ListNode prev = groupNext;
            ListNode cur = groupPrev.next;
            while (cur != groupNext) {
                ListNode next = cur.next;
                cur.next = prev;
                prev = cur;
                cur = next;
            }
            ListNode newGroupStart = groupPrev.next;
            groupPrev.next = groupLast;
            groupPrev = newGroupStart;
        }
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* reverseKGroup_kth(ListNode* start, int k) {
    ListNode* n = start;
    for (int i = 0; i < k; i++) {
        if (!n) {
            return nullptr;
        }
        n = n->next;
    }
    return n;
}

ListNode* reverseKGroup(ListNode* head, int k) {
    ListNode* dummy = new ListNode(0, head);
    ListNode* groupPrev = dummy;
    while (true) {
        ListNode* groupLast = reverseKGroup_kth(groupPrev, k);
        if (!groupLast) {
            break;
        }
        ListNode* groupNext = groupLast->next;
        ListNode* prev = groupNext;
        ListNode* cur = groupPrev->next;
        while (cur != groupNext) {
            ListNode* next = cur->next;
            cur->next = prev;
            prev = cur;
            cur = next;
        }
        ListNode* newGroupStart = groupPrev->next;
        groupPrev->next = groupLast;
        groupPrev = newGroupStart;
    }
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* reverseKGroup_kth(struct Node* start, int k) {
    struct Node* n = start;
    for (int i = 0; i < k; i++) {
        if (!n) {
            return NULL;
        }
        n = n->next;
    }
    return n;
}

struct Node* reverseKGroup(struct Node* head, int k) {
    struct Node* dummy = newNode(0, head);
    struct Node* groupPrev = dummy;
    while (true) {
        struct Node* groupLast = reverseKGroup_kth(groupPrev, k);
        if (!groupLast) {
            break;
        }
        struct Node* groupNext = groupLast->next;
        struct Node* prev = groupNext;
        struct Node* cur = groupPrev->next;
        while (cur != groupNext) {
            struct Node* next = cur->next;
            cur->next = prev;
            prev = cur;
            cur = next;
        }
        struct Node* newGroupStart = groupPrev->next;
        groupPrev->next = groupLast;
        groupPrev = newGroupStart;
    }
    return dummy->next;
}`
          }
        }
      ]
    },
    {
      id: 11,
      level: "intermediate",
      q: "Copy List with Random Pointer",
      ask: "Amazon · Microsoft · Meta · Google",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/copy-list-with-random-pointer/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/clone-a-linked-list-with-next-and-random-pointer/1"}],
      a: "Each node has val, next, and random (any node or null). Return a deep copy: new nodes, same layout of next and random.\n\nA copy's random must point at the copied target, not the original. An empty list copies to null.\n\nA Map from old node to new node, filled in one or two walks, is the clean extra-space answer. The weave method inserts each copy after its original, assigns random via original.random.next, then unweaves.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "First pass: clone every node into a Map, next and random left null. Second pass: wire next and random through the map. Two walks, extra map of n nodes.",
          code: `function Node(val, next, random) {
  this.val = val;
  this.next = next === undefined ? null : next;
  this.random = random === undefined ? null : random;
}

function copyRandomList(head) {
  const map = new Map();
  let cur = head;
  while (cur) {
    map.set(cur, new Node(cur.val));
    cur = cur.next;
  }
  cur = head;
  while (cur) {
    const copy = map.get(cur);
    copy.next = cur.next ? map.get(cur.next) : null;
    copy.random = cur.random ? map.get(cur.random) : null;
    cur = cur.next;
  }
  return head ? map.get(head) : null;
}`,
          codes: {
            javascript: `function Node(val, next, random) {
  this.val = val;
  this.next = next === undefined ? null : next;
  this.random = random === undefined ? null : random;
}

function copyRandomList(head) {
  const map = new Map();
  let cur = head;
  while (cur) {
    map.set(cur, new Node(cur.val));
    cur = cur.next;
  }
  cur = head;
  while (cur) {
    const copy = map.get(cur);
    copy.next = cur.next ? map.get(cur.next) : null;
    copy.random = cur.random ? map.get(cur.random) : null;
    cur = cur.next;
  }
  return head ? map.get(head) : null;
}`,
            python: `class Node:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random
def copyRandomList(head):
    map = {}
    cur = head
    while cur:
        map[cur] = Node(cur.val)
        cur = cur.next
    cur = head
    while cur:
        copy = map.get(cur)
        copy.next = (map.get(cur.next) if cur.next else None)
        copy.random = (map.get(cur.random) if cur.random else None)
        cur = cur.next
    return (map.get(head) if head else None)`,
            java: `import java.util.*;

class Node {
    int val;
    Node next;
    Node random;
    Node(int val) { this.val = val; }
    Node(int val, Node next, Node random) {
        this.val = val; this.next = next; this.random = random;
    }
}

class Solution {
    public Node copyRandomList(Node head) {
        Map<Node, Node> map = new HashMap<>();
        Node cur = head;
        while (cur != null) {
            map.put(cur, new Node(cur.val));
            cur = cur.next;
        }
        cur = head;
        while (cur != null) {
            Node copy = map.get(cur);
            copy.next = cur.next ? map.get(cur.next) : null;
            copy.random = cur.random ? map.get(cur.random) : null;
            cur = cur.next;
        }
        return head ? map.get(head) : null;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* random;
    Node(int x) : val(x), next(nullptr), random(nullptr) {}
    Node(int x, Node* next, Node* random) : val(x), next(next), random(random) {}
};

Node* copyRandomList(Node* head) {
    unordered_map<Node*, Node*> map;
    Node* cur = head;
    while (cur) {
        map[cur] = new Node(cur->val);
        cur = cur->next;
    }
    cur = head;
    while (cur) {
        Node* copy = map[cur];
        copy->next = cur->next ? map[cur->next] : nullptr;
        copy->random = cur->random ? map[cur->random] : nullptr;
        cur = cur->next;
    }
    return head ? map[head] : nullptr;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
    struct Node* random;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    n->random = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* copyRandomList(struct Node* head) {
    struct Node* mapK[10005]; struct Node* mapV[10005]; int mapn = 0;
    struct Node* cur = head;
    while (cur) {
        mapK[mapn] = cur; mapV[mapn++] = newNode(cur->val);
        cur = cur->next;
    }
    cur = head;
    while (cur) {
        struct Node* copy = map[cur];
        copy->next = cur->next ? map[cur->next] : NULL;
        copy->random = cur->random ? map[cur->random] : NULL;
        cur = cur->next;
    }
    return head ? map[head] : NULL;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "One recursive walk with a Map. If the node is already cloned, return it (handles random cycles). Otherwise clone, then fill next and random. Still O(n) extra map plus stack.",
          code: `function Node(val, next, random) {
  this.val = val;
  this.next = next === undefined ? null : next;
  this.random = random === undefined ? null : random;
}

function copyRandomList(head) {
  const map = new Map();
  function copy(node) {
    if (!node) return null;
    if (map.has(node)) return map.get(node);
    const cloned = new Node(node.val);
    map.set(node, cloned);
    cloned.next = copy(node.next);
    cloned.random = copy(node.random);
    return cloned;
  }
  return copy(head);
}`,
          codes: {
            javascript: `function Node(val, next, random) {
  this.val = val;
  this.next = next === undefined ? null : next;
  this.random = random === undefined ? null : random;
}

function copyRandomList(head) {
  const map = new Map();
  function copy(node) {
    if (!node) return null;
    if (map.has(node)) return map.get(node);
    const cloned = new Node(node.val);
    map.set(node, cloned);
    cloned.next = copy(node.next);
    cloned.random = copy(node.random);
    return cloned;
  }
  return copy(head);
}`,
            python: `class Node:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random
def copyRandomList(head):
    map = {}
    def copy(node):
        if not node:
            return None
        if (node in map):
            return map.get(node)
        cloned = Node(node.val)
        map[node] = cloned
        cloned.next = copy(node.next)
        cloned.random = copy(node.random)
        return cloned
    return copy(head)`,
            java: `import java.util.*;

class Node {
    int val;
    Node next;
    Node random;
    Node(int val) { this.val = val; }
    Node(int val, Node next, Node random) {
        this.val = val; this.next = next; this.random = random;
    }
}

class Solution {
    private Node copyRandomList_copy(Node node) {
        if (node == null) {
            return null;
        }
        if (map.contains(node)) {
            return map.get(node);
        }
        Node cloned = new Node(node.val);
        map.put(node, cloned);
        cloned.next = copyRandomList_copy(node.next);
        cloned.random = copyRandomList_copy(node.random);
        return cloned;
    }

    public Node copyRandomList(Node head) {
        Map<Node, Node> map = new HashMap<>();
        return copyRandomList_copy(head);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* random;
    Node(int x) : val(x), next(nullptr), random(nullptr) {}
    Node(int x, Node* next, Node* random) : val(x), next(next), random(random) {}
};

Node* copyRandomList_copy(Node* node) {
    if (!node) {
        return nullptr;
    }
    if (map.count(node)) {
        return map[node];
    }
    Node* cloned = new Node(node->val);
    map[node] = cloned;
    cloned->next = copyRandomList_copy(node->next);
    cloned->random = copyRandomList_copy(node->random);
    return cloned;
}

Node* copyRandomList(Node* head) {
    unordered_map<Node*, Node*> map;
    return copyRandomList_copy(head);
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
    struct Node* random;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    n->random = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* copyRandomList_copy(struct Node* node) {
    if (!node) {
        return NULL;
    }
    if (containsPtr(map, mapn, node)) {
        return map[node];
    }
    struct Node* cloned = newNode(node->val);
    mapK[mapn] = node; mapV[mapn++] = cloned;
    cloned->next = copyRandomList_copy(node->next);
    cloned->random = copyRandomList_copy(node->random);
    return cloned;
}

struct Node* copyRandomList(struct Node* head) {
    struct Node* mapK[10005]; struct Node* mapV[10005]; int mapn = 0;
    return copyRandomList_copy(head);
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Weave: original -> copy -> original.next. Set copy.random from original.random.next. Unweave into two lists. Extra space is the copies themselves, no hash map. (O(1) auxiliary.)",
          code: `function Node(val, next, random) {
  this.val = val;
  this.next = next === undefined ? null : next;
  this.random = random === undefined ? null : random;
}

function copyRandomList(head) {
  if (!head) return null;
  let cur = head;
  while (cur) {
    const copy = new Node(cur.val, cur.next, null);
    cur.next = copy;
    cur = copy.next;
  }
  cur = head;
  while (cur) {
    if (cur.random) cur.next.random = cur.random.next;
    cur = cur.next.next;
  }
  const newHead = head.next;
  cur = head;
  while (cur) {
    const copy = cur.next;
    cur.next = copy.next;
    copy.next = copy.next ? copy.next.next : null;
    cur = cur.next;
  }
  return newHead;
}`,
          codes: {
            javascript: `function Node(val, next, random) {
  this.val = val;
  this.next = next === undefined ? null : next;
  this.random = random === undefined ? null : random;
}

function copyRandomList(head) {
  if (!head) return null;
  let cur = head;
  while (cur) {
    const copy = new Node(cur.val, cur.next, null);
    cur.next = copy;
    cur = copy.next;
  }
  cur = head;
  while (cur) {
    if (cur.random) cur.next.random = cur.random.next;
    cur = cur.next.next;
  }
  const newHead = head.next;
  cur = head;
  while (cur) {
    const copy = cur.next;
    cur.next = copy.next;
    copy.next = copy.next ? copy.next.next : null;
    cur = cur.next;
  }
  return newHead;
}`,
            python: `class Node:
    def __init__(self, val=0, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random
def copyRandomList(head):
    if not head:
        return None
    cur = head
    while cur:
        copy = Node(cur.val, cur.next, None)
        cur.next = copy
        cur = copy.next
    cur = head
    while cur:
        if cur.random:
            cur.next.random = cur.random.next
        cur = cur.next.next
    newHead = head.next
    cur = head
    while cur:
        copy = cur.next
        cur.next = copy.next
        copy.next = (copy.next.next if copy.next else None)
        cur = cur.next
    return newHead`,
            java: `import java.util.*;

class Node {
    int val;
    Node next;
    Node random;
    Node(int val) { this.val = val; }
    Node(int val, Node next, Node random) {
        this.val = val; this.next = next; this.random = random;
    }
}

class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) {
            return null;
        }
        Node cur = head;
        while (cur != null) {
            Node copy = new Node(cur.val, cur.next, null);
            cur.next = copy;
            cur = copy.next;
        }
        cur = head;
        while (cur != null) {
            if (cur.random != null) {
                cur.next.random = cur.random.next;
            }
            cur = cur.next.next;
        }
        Node newHead = head.next;
        cur = head;
        while (cur != null) {
            Node copy = cur.next;
            cur.next = copy.next;
            copy.next = copy.next ? copy.next.next : null;
            cur = cur.next;
        }
        return newHead;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* next;
    Node* random;
    Node(int x) : val(x), next(nullptr), random(nullptr) {}
    Node(int x, Node* next, Node* random) : val(x), next(next), random(random) {}
};

Node* copyRandomList(Node* head) {
    if (!head) {
        return nullptr;
    }
    Node* cur = head;
    while (cur) {
        Node* copy = new Node(cur->val, cur->next, nullptr);
        cur->next = copy;
        cur = copy->next;
    }
    cur = head;
    while (cur) {
        if (cur->random) {
            cur->next.random = cur->random.next;
        }
        cur = cur->next.next;
    }
    Node* newHead = head->next;
    cur = head;
    while (cur) {
        Node* copy = cur->next;
        cur->next = copy->next;
        copy->next = copy->next ? copy->next.next : nullptr;
        cur = cur->next;
    }
    return newHead;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
    struct Node* random;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    n->random = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* copyRandomList(struct Node* head) {
    if (!head) {
        return NULL;
    }
    struct Node* cur = head;
    while (cur) {
        struct Node* copy = newNode(cur->val, cur->next, NULL);
        cur->next = copy;
        cur = copy->next;
    }
    cur = head;
    while (cur) {
        if (cur->random) {
            cur->next.random = cur->random.next;
        }
        cur = cur->next.next;
    }
    struct Node* newHead = head->next;
    cur = head;
    while (cur) {
        struct Node* copy = cur->next;
        cur->next = copy->next;
        copy->next = copy->next ? copy->next.next : NULL;
        cur = cur->next;
    }
    return newHead;
}`
          }
        }
      ]
    },
    {
      id: 12,
      level: "intermediate",
      q: "Sort List",
      ask: "Amazon · Meta · Microsoft · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/sort-list/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/sort-a-linked-list/1"}],
      a: "Sort a linked list in O(n log n) time. Prefer constant extra space if you can.\n\n4 -> 2 -> 1 -> 3 becomes 1 -> 2 -> 3 -> 4. Values may be negative.\n\nCollect, sort the array, rewrite vals. Top-down merge sort splits at the middle with slow/fast. Bottom-up merge sort iterates run lengths 1, 2, 4, ... and uses O(1) extra pointers.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n log n)",
          space: "O(n)",
          why: "Push values, sort the array, write them back onto the existing nodes. Extra array. Does not show list merge sort.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortList(head) {
  const vals = [];
  let cur = head;
  while (cur) {
    vals.push(cur.val);
    cur = cur.next;
  }
  vals.sort((a, b) => a - b);
  cur = head;
  let i = 0;
  while (cur) {
    cur.val = vals[i++];
    cur = cur.next;
  }
  return head;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortList(head) {
  const vals = [];
  let cur = head;
  while (cur) {
    vals.push(cur.val);
    cur = cur.next;
  }
  vals.sort((a, b) => a - b);
  cur = head;
  let i = 0;
  while (cur) {
    cur.val = vals[i++];
    cur = cur.next;
  }
  return head;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def sortList(head):
    vals = []
    cur = head
    while cur:
        vals.append(cur.val)
        cur = cur.next
    vals.sort()
    cur = head
    i = 0
    while cur:
        cur.val = vals[i]
        i += 1
        cur = cur.next
    return head`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode sortList(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        ListNode cur = head;
        while (cur != null) {
            vals.add(cur.val);
            cur = cur.next;
        }
        Collections.sort(vals);
        cur = head;
        int i = 0;
        while (cur != null) {
            cur.val = vals[i++];
            cur = cur.next;
        }
        return head;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* sortList(ListNode* head) {
    vector<int> vals;
    ListNode* cur = head;
    while (cur) {
        vals.push_back(cur->val);
        cur = cur->next;
    }
    sort(vals.begin(), vals.end());
    cur = head;
    int i = 0;
    while (cur) {
        cur->val = vals[i++];
        cur = cur->next;
    }
    return head;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* sortList(struct Node* head) {
    int vals[10005]; int valsn = 0;
    struct Node* cur = head;
    while (cur) {
        vals[valsn++] = cur->val;
        cur = cur->next;
    }
    qsort(vals, valsn, sizeof(int), cmpInt);
    cur = head;
    int i = 0;
    while (cur) {
        cur->val = vals[i++];
        cur = cur->next;
    }
    return head;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n log n)",
          space: "O(log n)",
          why: "Top-down merge sort. Slow/fast splits the list, recurse both halves, merge sorted chains. Stack is O(log n) for balanced splits.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortList(head) {
  if (!head || !head.next) return head;
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const mid = slow.next;
  slow.next = null;
  return merge(sortList(head), sortList(mid));
}

function merge(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val < b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a || b;
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortList(head) {
  if (!head || !head.next) return head;
  let slow = head;
  let fast = head.next;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  const mid = slow.next;
  slow.next = null;
  return merge(sortList(head), sortList(mid));
}

function merge(a, b) {
  const dummy = new ListNode(0);
  let tail = dummy;
  while (a && b) {
    if (a.val < b.val) {
      tail.next = a;
      a = a.next;
    } else {
      tail.next = b;
      b = b.next;
    }
    tail = tail.next;
  }
  tail.next = a || b;
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def sortList(head):
    if not head  or  not head.next:
        return head
    slow = head
    fast = head.next
    while fast  and  fast.next:
        slow = slow.next
        fast = fast.next.next
    mid = slow.next
    slow.next = None
    return merge(sortList(head), sortList(mid))
def merge(a, b):
    dummy = ListNode(0)
    tail = dummy
    while a  and  b:
        if a.val < b.val:
            tail.next = a
            a = a.next
        else:
            tail.next = b
            b = b.next
        tail = tail.next
    tail.next = a  or  b
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode slow = head;
        ListNode fast = head.next;
        while (fast != null && fast.next != null) {
            slow = slow.next;
            fast = fast.next.next;
        }
        ListNode mid = slow.next;
        slow.next = null;
        return merge(sortList(head), sortList(mid));
    }

    public ListNode merge(ListNode a, ListNode b) {
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        while (a != null && b != null) {
            if (a.val < b.val) {
                tail.next = a;
                a = a.next;
            }
            else {
                tail.next = b;
                b = b.next;
            }
            tail = tail.next;
        }
        tail.next = a || b;
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* sortList(ListNode* head) {
    if (!head || !head->next) {
        return head;
    }
    ListNode* slow = head;
    ListNode* fast = head->next;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
    }
    ListNode* mid = slow->next;
    slow->next = nullptr;
    return merge(sortList(head), sortList(mid));
}

ListNode* merge(ListNode* a, ListNode* b) {
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    while (a && b) {
        if (a->val < b->val) {
            tail->next = a;
            a = a->next;
        }
        else {
            tail->next = b;
            b = b->next;
        }
        tail = tail->next;
    }
    tail->next = a || b;
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* sortList(struct Node* head) {
    if (!head || !head->next) {
        return head;
    }
    struct Node* slow = head;
    struct Node* fast = head->next;
    while (fast && fast->next) {
        slow = slow->next;
        fast = fast->next.next;
    }
    struct Node* mid = slow->next;
    slow->next = NULL;
    return merge(sortList(head), sortList(mid));
}

struct Node* merge(struct Node* a, struct Node* b) {
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    while (a && b) {
        if (a->val < b->val) {
            tail->next = a;
            a = a->next;
        }
        else {
            tail->next = b;
            b = b->next;
        }
        tail = tail->next;
    }
    tail->next = a || b;
    return dummy->next;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n log n)",
          space: "O(1)",
          why: "Bottom-up merge sort. Count n, then merge adjacent runs of size step, doubling step. split cuts a run. merge hangs the merged pair after prev. No recursion stack.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortList(head) {
  if (!head || !head.next) return head;
  let n = 0;
  for (let p = head; p; p = p.next) n++;
  const dummy = new ListNode(0, head);

  function split(start, len) {
    let p = start;
    for (let i = 1; p && i < len; i++) p = p.next;
    if (!p) return null;
    const rest = p.next;
    p.next = null;
    return rest;
  }

  function merge(prev, a, b) {
    let tail = prev;
    while (a && b) {
      if (a.val < b.val) {
        tail.next = a;
        a = a.next;
      } else {
        tail.next = b;
        b = b.next;
      }
      tail = tail.next;
    }
    tail.next = a || b;
    while (tail.next) tail = tail.next;
    return tail;
  }

  for (let step = 1; step < n; step *= 2) {
    let prev = dummy;
    let cur = dummy.next;
    while (cur) {
      const left = cur;
      const right = split(left, step);
      cur = split(right, step);
      prev = merge(prev, left, right);
    }
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function sortList(head) {
  if (!head || !head.next) return head;
  let n = 0;
  for (let p = head; p; p = p.next) n++;
  const dummy = new ListNode(0, head);

  function split(start, len) {
    let p = start;
    for (let i = 1; p && i < len; i++) p = p.next;
    if (!p) return null;
    const rest = p.next;
    p.next = null;
    return rest;
  }

  function merge(prev, a, b) {
    let tail = prev;
    while (a && b) {
      if (a.val < b.val) {
        tail.next = a;
        a = a.next;
      } else {
        tail.next = b;
        b = b.next;
      }
      tail = tail.next;
    }
    tail.next = a || b;
    while (tail.next) tail = tail.next;
    return tail;
  }

  for (let step = 1; step < n; step *= 2) {
    let prev = dummy;
    let cur = dummy.next;
    while (cur) {
      const left = cur;
      const right = split(left, step);
      cur = split(right, step);
      prev = merge(prev, left, right);
    }
  }
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def sortList(head):
    if not head  or  not head.next:
        return head
    n = 0
    p = head
    while p:
        n += 1
        p = p.next
    dummy = ListNode(0, head)
    def split(start, len):
        p = start
        i = 1
        while p  and  i < len:
            p = p.next
            i += 1
        if not p:
            return None
        rest = p.next
        p.next = None
        return rest
    def merge(prev, a, b):
        tail = prev
        while a  and  b:
            if a.val < b.val:
                tail.next = a
                a = a.next
            else:
                tail.next = b
                b = b.next
            tail = tail.next
        tail.next = a  or  b
        while tail.next:
            tail = tail.next
        return tail
    step = 1
    while step < n:
        prev = dummy
        cur = dummy.next
        while cur:
            left = cur
            right = split(left, step)
            cur = split(right, step)
            prev = merge(prev, left, right)
        step *= 2
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    private ListNode sortList_split(ListNode start, int len) {
        ListNode p = start;
        for (int i = 1; p != null && i < len; i++) {
            p = p.next;
        }
        if (p == null) {
            return null;
        }
        ListNode rest = p.next;
        p.next = null;
        return rest;
    }

    private ListNode sortList_merge(ListNode prev, ListNode a, ListNode b) {
        ListNode tail = prev;
        while (a != null && b != null) {
            if (a.val < b.val) {
                tail.next = a;
                a = a.next;
            }
            else {
                tail.next = b;
                b = b.next;
            }
            tail = tail.next;
        }
        tail.next = a || b;
        while (tail.next != null) {
            tail = tail.next;
        }
        return tail;
    }

    public ListNode sortList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        int n = 0;
        ListNode p = head;
        for (; p != null; p = p.next) {
            n++;
        }
        ListNode dummy = new ListNode(0, head);
        for (int step = 1; step < n; step *= 2) {
            ListNode prev = dummy;
            ListNode cur = dummy.next;
            while (cur != null) {
                ListNode left = cur;
                ListNode right = sortList_split(left, step);
                cur = sortList_split(right, step);
                prev = sortList_merge(prev, left, right);
            }
        }
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* sortList_split(ListNode* start, int len) {
    ListNode* p = start;
    for (int i = 1; p && i < len; i++) {
        p = p->next;
    }
    if (!p) {
        return nullptr;
    }
    ListNode* rest = p->next;
    p->next = nullptr;
    return rest;
}

ListNode* sortList_merge(ListNode* prev, ListNode* a, ListNode* b) {
    ListNode* tail = prev;
    while (a && b) {
        if (a->val < b->val) {
            tail->next = a;
            a = a->next;
        }
        else {
            tail->next = b;
            b = b->next;
        }
        tail = tail->next;
    }
    tail->next = a || b;
    while (tail->next) {
        tail = tail->next;
    }
    return tail;
}

ListNode* sortList(ListNode* head) {
    if (!head || !head->next) {
        return head;
    }
    int n = 0;
    ListNode* p = head;
    for (; p; p = p->next) {
        n++;
    }
    ListNode* dummy = new ListNode(0, head);
    for (int step = 1; step < n; step *= 2) {
        ListNode* prev = dummy;
        ListNode* cur = dummy->next;
        while (cur) {
            ListNode* left = cur;
            ListNode* right = sortList_split(left, step);
            cur = sortList_split(right, step);
            prev = sortList_merge(prev, left, right);
        }
    }
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* sortList_split(struct Node* start, int len) {
    struct Node* p = start;
    for (int i = 1; p && i < len; i++) {
        p = p->next;
    }
    if (!p) {
        return NULL;
    }
    struct Node* rest = p->next;
    p->next = NULL;
    return rest;
}

struct Node* sortList_merge(struct Node* prev, struct Node* a, struct Node* b) {
    struct Node* tail = prev;
    while (a && b) {
        if (a->val < b->val) {
            tail->next = a;
            a = a->next;
        }
        else {
            tail->next = b;
            b = b->next;
        }
        tail = tail->next;
    }
    tail->next = a || b;
    while (tail->next) {
        tail = tail->next;
    }
    return tail;
}

struct Node* sortList(struct Node* head) {
    if (!head || !head->next) {
        return head;
    }
    int n = 0;
    struct Node* p = head;
    for (; p; p = p->next) {
        n++;
    }
    struct Node* dummy = newNode(0, head);
    for (int step = 1; step < n; step *= 2) {
        struct Node* prev = dummy;
        struct Node* cur = dummy->next;
        while (cur) {
            struct Node* left = cur;
            struct Node* right = sortList_split(left, step);
            cur = sortList_split(right, step);
            prev = sortList_merge(prev, left, right);
        }
    }
    return dummy->next;
}`
          }
        }
      ]
    },
    {
      id: 13,
      level: "beginner",
      q: "Remove Duplicates from Sorted List",
      ask: "Amazon · Apple · Adobe · Microsoft",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/remove-duplicates-from-sorted-list/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/remove-duplicate-element-from-sorted-linked-list/1"}],
      a: "The list is sorted. Delete extra nodes so each number appears once. Keep the first copy of each value.\n\n1 -> 1 -> 2 -> 3 -> 3 becomes 1 -> 2 -> 3. An already-unique list does not change.\n\nCollect unique values into an array and rebuild. Recursion skips a next that matches head.val. Iteration: while cur.next exists and equals cur.val, jump cur.next.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Walk and push a value only when it differs from the last kept one, then rebuild. Extra array of uniques.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function deleteDuplicates(head) {
  const vals = [];
  let cur = head;
  while (cur) {
    if (vals.length === 0 || vals[vals.length - 1] !== cur.val) {
      vals.push(cur.val);
    }
    cur = cur.next;
  }
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function deleteDuplicates(head) {
  const vals = [];
  let cur = head;
  while (cur) {
    if (vals.length === 0 || vals[vals.length - 1] !== cur.val) {
      vals.push(cur.val);
    }
    cur = cur.next;
  }
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of vals) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def deleteDuplicates(head):
    vals = []
    cur = head
    while cur:
        if len(vals) == 0  or  vals[-1] != cur.val:
            vals.append(cur.val)
        cur = cur.next
    dummy = ListNode(0)
    tail = dummy
    for v in vals:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        List<Integer> vals = new ArrayList<>();
        ListNode cur = head;
        while (cur != null) {
            if (vals.size() == 0 || vals.get(vals.size()-1) != cur.val) {
                vals.add(cur.val);
            }
            cur = cur.next;
        }
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (var v : vals) {
            tail.next = new ListNode(v);
            tail = tail.next;
        }
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* deleteDuplicates(ListNode* head) {
    vector<int> vals;
    ListNode* cur = head;
    while (cur) {
        if (vals.size() == 0 || vals.back() != cur->val) {
            vals.push_back(cur->val);
        }
        cur = cur->next;
    }
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    for (auto v : vals) {
        tail->next = new ListNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* deleteDuplicates(struct Node* head) {
    int vals[10005]; int valsn = 0;
    struct Node* cur = head;
    while (cur) {
        if (valsn == 0 || vals[valsn - 1] != cur->val) {
            vals[valsn++] = cur->val;
        }
        cur = cur->next;
    }
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    for (int _i = 0; _i < valsn; _i++) { int v = vals[_i];
        tail->next = newNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Recurse on head.next first. If the next node has the same val, skip it. Stack is O(n).",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function deleteDuplicates(head) {
  if (!head || !head.next) return head;
  head.next = deleteDuplicates(head.next);
  if (head.next && head.next.val === head.val) return head.next;
  return head;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function deleteDuplicates(head) {
  if (!head || !head.next) return head;
  head.next = deleteDuplicates(head.next);
  if (head.next && head.next.val === head.val) return head.next;
  return head;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def deleteDuplicates(head):
    if not head  or  not head.next:
        return head
    head.next = deleteDuplicates(head.next)
    if head.next  and  head.next.val == head.val:
        return head.next
    return head`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        head.next = deleteDuplicates(head.next);
        if (head.next != null && head.next.val == head.val) {
            return head.next;
        }
        return head;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* deleteDuplicates(ListNode* head) {
    if (!head || !head->next) {
        return head;
    }
    head->next = deleteDuplicates(head->next);
    if (head->next && head->next.val == head->val) {
        return head->next;
    }
    return head;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* deleteDuplicates(struct Node* head) {
    if (!head || !head->next) {
        return head;
    }
    head->next = deleteDuplicates(head->next);
    if (head->next && head->next.val == head->val) {
        return head->next;
    }
    return head;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "One pointer. While the next node duplicates, skip it. Then advance. In-place, constant extra space.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function deleteDuplicates(head) {
  let cur = head;
  while (cur && cur.next) {
    if (cur.val === cur.next.val) cur.next = cur.next.next;
    else cur = cur.next;
  }
  return head;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function deleteDuplicates(head) {
  let cur = head;
  while (cur && cur.next) {
    if (cur.val === cur.next.val) cur.next = cur.next.next;
    else cur = cur.next;
  }
  return head;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def deleteDuplicates(head):
    cur = head
    while cur  and  cur.next:
        if cur.val == cur.next.val:
            cur.next = cur.next.next
        else:
            cur = cur.next
    return head`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        ListNode cur = head;
        while (cur != null && cur.next != null) {
            if (cur.val == cur.next.val) {
                cur.next = cur.next.next;
            }
            else {
                cur = cur.next;
            }
        }
        return head;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* deleteDuplicates(ListNode* head) {
    ListNode* cur = head;
    while (cur && cur->next) {
        if (cur->val == cur->next.val) {
            cur->next = cur->next.next;
        }
        else {
            cur = cur->next;
        }
    }
    return head;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* deleteDuplicates(struct Node* head) {
    struct Node* cur = head;
    while (cur && cur->next) {
        if (cur->val == cur->next.val) {
            cur->next = cur->next.next;
        }
        else {
            cur = cur->next;
        }
    }
    return head;
}`
          }
        }
      ]
    },
    {
      id: 14,
      level: "intermediate",
      q: "Swap Nodes in Pairs",
      ask: "Amazon · Microsoft · Uber · Adobe",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/swap-nodes-in-pairs/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/pairwise-swap-elements-of-a-linked-list-by-swapping-data/1"}],
      a: "Swap every two adjacent nodes. Swap the nodes, not only their values. If a last node has no pair, leave it.\n\n1 -> 2 -> 3 -> 4 becomes 2 -> 1 -> 4 -> 3. 1 -> 2 -> 3 becomes 2 -> 1 -> 3.\n\nArray of nodes, swap indexes 0-1, 2-3, relink. Recursion swaps the first pair then attaches swapPairs of the rest. Iteration uses a dummy and rewires two nodes at a time.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Collect nodes, swap each pair of indexes, relink in that order. Extra array.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function swapPairs(head) {
  const nodes = [];
  let cur = head;
  while (cur) {
    nodes.push(cur);
    cur = cur.next;
  }
  for (let i = 0; i + 1 < nodes.length; i += 2) {
    const t = nodes[i];
    nodes[i] = nodes[i + 1];
    nodes[i + 1] = t;
  }
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const node of nodes) {
    tail.next = node;
    tail = tail.next;
  }
  tail.next = null;
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function swapPairs(head) {
  const nodes = [];
  let cur = head;
  while (cur) {
    nodes.push(cur);
    cur = cur.next;
  }
  for (let i = 0; i + 1 < nodes.length; i += 2) {
    const t = nodes[i];
    nodes[i] = nodes[i + 1];
    nodes[i + 1] = t;
  }
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const node of nodes) {
    tail.next = node;
    tail = tail.next;
  }
  tail.next = null;
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def swapPairs(head):
    nodes = []
    cur = head
    while cur:
        nodes.append(cur)
        cur = cur.next
    i = 0
    while i + 1 < len(nodes):
        t = nodes[i]
        nodes[i] = nodes[i + 1]
        nodes[i + 1] = t
        i += 2
    dummy = ListNode(0)
    tail = dummy
    for node in nodes:
        tail.next = node
        tail = tail.next
    tail.next = None
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode swapPairs(ListNode head) {
        List<ListNode> nodes = new ArrayList<>();
        ListNode cur = head;
        while (cur != null) {
            nodes.add(cur);
            cur = cur.next;
        }
        for (int i = 0; i + 1 < nodes.size(); i += 2) {
            int t = nodes[i];
            nodes[i] = nodes[i + 1];
            nodes[i + 1] = t;
        }
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (var node : nodes) {
            tail.next = node;
            tail = tail.next;
        }
        tail.next = null;
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* swapPairs(ListNode* head) {
    vector<ListNode*> nodes;
    ListNode* cur = head;
    while (cur) {
        nodes.push_back(cur);
        cur = cur->next;
    }
    for (int i = 0; i + 1 < nodes.size(); i += 2) {
        int t = nodes[i];
        nodes[i] = nodes[i + 1];
        nodes[i + 1] = t;
    }
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    for (auto node : nodes) {
        tail->next = node;
        tail = tail->next;
    }
    tail->next = nullptr;
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* swapPairs(struct Node* head) {
    struct Node* nodes[10005]; int nodesn = 0;
    struct Node* cur = head;
    while (cur) {
        nodes[nodesn++] = cur;
        cur = cur->next;
    }
    for (int i = 0; i + 1 < nodesn; i += 2) {
        int t = nodes[i];
        nodes[i] = nodes[i + 1];
        nodes[i + 1] = t;
    }
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    for (int _i = 0; _i < nodesn; _i++) { struct Node* node = nodes[_i];
        tail->next = node;
        tail = tail->next;
    }
    tail->next = NULL;
    return dummy->next;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "If fewer than two nodes, return head. Else first = head, second = head.next, first.next = swapPairs(second.next), second.next = first, return second. Stack O(n/2).",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function swapPairs(head) {
  if (!head || !head.next) return head;
  const first = head;
  const second = head.next;
  first.next = swapPairs(second.next);
  second.next = first;
  return second;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function swapPairs(head) {
  if (!head || !head.next) return head;
  const first = head;
  const second = head.next;
  first.next = swapPairs(second.next);
  second.next = first;
  return second;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def swapPairs(head):
    if not head  or  not head.next:
        return head
    first = head
    second = head.next
    first.next = swapPairs(second.next)
    second.next = first
    return second`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode swapPairs(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode first = head;
        ListNode second = head.next;
        first.next = swapPairs(second.next);
        second.next = first;
        return second;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* swapPairs(ListNode* head) {
    if (!head || !head->next) {
        return head;
    }
    ListNode* first = head;
    ListNode* second = head->next;
    first->next = swapPairs(second->next);
    second->next = first;
    return second;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* swapPairs(struct Node* head) {
    if (!head || !head->next) {
        return head;
    }
    struct Node* first = head;
    struct Node* second = head->next;
    first->next = swapPairs(second->next);
    second->next = first;
    return second;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Dummy before head. prev, a, b: prev.next = b, a.next = b.next, b.next = a, then prev = a. Iterative, constant extra space.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function swapPairs(head) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next && prev.next.next) {
    const a = prev.next;
    const b = a.next;
    prev.next = b;
    a.next = b.next;
    b.next = a;
    prev = a;
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function swapPairs(head) {
  const dummy = new ListNode(0, head);
  let prev = dummy;
  while (prev.next && prev.next.next) {
    const a = prev.next;
    const b = a.next;
    prev.next = b;
    a.next = b.next;
    b.next = a;
    prev = a;
  }
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def swapPairs(head):
    dummy = ListNode(0, head)
    prev = dummy
    while prev.next  and  prev.next.next:
        a = prev.next
        b = a.next
        prev.next = b
        a.next = b.next
        b.next = a
        prev = a
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0, head);
        ListNode prev = dummy;
        while (prev.next != null && prev.next.next != null) {
            ListNode a = prev.next;
            ListNode b = a.next;
            prev.next = b;
            a.next = b.next;
            b.next = a;
            prev = a;
        }
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* swapPairs(ListNode* head) {
    ListNode* dummy = new ListNode(0, head);
    ListNode* prev = dummy;
    while (prev->next && prev->next.next) {
        ListNode* a = prev->next;
        ListNode* b = a->next;
        prev->next = b;
        a->next = b->next;
        b->next = a;
        prev = a;
    }
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* swapPairs(struct Node* head) {
    struct Node* dummy = newNode(0, head);
    struct Node* prev = dummy;
    while (prev->next && prev->next.next) {
        struct Node* a = prev->next;
        struct Node* b = a->next;
        prev->next = b;
        a->next = b->next;
        b->next = a;
        prev = a;
    }
    return dummy->next;
}`
          }
        }
      ]
    },
    {
      id: 15,
      level: "intermediate",
      q: "Rotate List",
      ask: "Amazon · Microsoft · Adobe · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/rotate-list/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/rotate-a-linked-list/1"}],
      a: "Rotate the list to the right by k places. k may be larger than the length, so use k modulo n.\n\n1 -> 2 -> 3 -> 4 -> 5 and k = 2 becomes 4 -> 5 -> 1 -> 2 -> 3. k = 0 leaves the list unchanged.\n\nArray rotate then rebuild. Recursion is a weak fit; two-pass length plus cut is cleaner. Best: make a ring, walk n - k % n steps from the old head, break the ring.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Copy values, rotate the array with splice/concat or new indexes, rebuild. Extra array.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function rotateRight(head, k) {
  if (!head) return head;
  const vals = [];
  for (let p = head; p; p = p.next) vals.push(p.val);
  k = k % vals.length;
  const rotated = vals.slice(vals.length - k).concat(vals.slice(0, vals.length - k));
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of rotated) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function rotateRight(head, k) {
  if (!head) return head;
  const vals = [];
  for (let p = head; p; p = p.next) vals.push(p.val);
  k = k % vals.length;
  const rotated = vals.slice(vals.length - k).concat(vals.slice(0, vals.length - k));
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const v of rotated) {
    tail.next = new ListNode(v);
    tail = tail.next;
  }
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def rotateRight(head, k):
    if not head:
        return head
    vals = []
    p = head
    while p:
        vals.append(p.val)
        p = p.next
    k = k % len(vals)
    rotated = vals[len(vals) - k).concat(vals[0:len(vals) - k]:]
    dummy = ListNode(0)
    tail = dummy
    for v in rotated:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null) {
            return head;
        }
        List<Integer> vals = new ArrayList<>();
        ListNode p = head;
        for (; p != null; p = p.next) {
            vals.add(p.val);
        }
        k = k % vals.size();
        int rotated = new ArrayList<>(vals.subList(vals.size() - k).concat(new ArrayList<>(vals.subList(0, vals.size(, vals.size()))) - k));
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (var v : rotated) {
            tail.next = new ListNode(v);
            tail = tail.next;
        }
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* rotateRight(ListNode* head, int k) {
    if (!head) {
        return head;
    }
    vector<int> vals;
    ListNode* p = head;
    for (; p; p = p->next) {
        vals.push_back(p->val);
    }
    k = k % vals.size();
    int rotated = vector<int>(vals.begin()+vals.size() - k).concat(vector<int>(vals.begin()+0, vals.begin(, vals.end())+vals.size() - k));
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    for (auto v : rotated) {
        tail->next = new ListNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* rotateRight(struct Node* head, int k) {
    if (!head) {
        return head;
    }
    int vals[10005]; int valsn = 0;
    struct Node* p = head;
    for (; p; p = p->next) {
        vals[valsn++] = p->val;
    }
    k = k % valsn;
    int rotated = vals);
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    for (int _i = 0; _i < rotatedn; _i++) { struct Node* v = rotated[_i];
        tail->next = newNode(v);
        tail = tail->next;
    }
    return dummy->next;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Recursive helper finds length and the tail, then a second walk cuts at n-k. Stack for the first walk is O(n). Same idea as counting, with recursion instead of a loop for length.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function rotateRight(head, k) {
  if (!head || !head.next) return head;
  const box = { n: 0, tail: null };
  function count(node) {
    if (!node) return;
    box.n++;
    box.tail = node;
    count(node.next);
  }
  count(head);
  k = k % box.n;
  if (k === 0) return head;
  let steps = box.n - k;
  let cur = head;
  for (let i = 1; i < steps; i++) cur = cur.next;
  const newHead = cur.next;
  cur.next = null;
  box.tail.next = head;
  return newHead;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function rotateRight(head, k) {
  if (!head || !head.next) return head;
  const box = { n: 0, tail: null };
  function count(node) {
    if (!node) return;
    box.n++;
    box.tail = node;
    count(node.next);
  }
  count(head);
  k = k % box.n;
  if (k === 0) return head;
  let steps = box.n - k;
  let cur = head;
  for (let i = 1; i < steps; i++) cur = cur.next;
  const newHead = cur.next;
  cur.next = null;
  box.tail.next = head;
  return newHead;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def rotateRight(head, k):
    if not head  or  not head.next:
        return head
    box = {"n": 0, "tail": None}
    def count(node):
        if not node:
            return
        box["n"] += 1
        box["tail"] = node
        count(node.next)
    count(head)
    k = k % box["n"]
    if k == 0:
        return head
    steps = box["n"] - k
    cur = head
    for i in range(1, steps):
        cur = cur.next
    newHead = cur.next
    cur.next = None
    box["tail"].next = head
    return newHead`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    private int rotateRight_count(ListNode node) {
        if (node == null) {
            return;
        }
        box_n++;
        box_tail = node;
        rotateRight_count(node.next);
    }

    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null) {
            return head;
        }
        int box_n = 0;
        ListNode box_tail = null;
        rotateRight_count(head);
        k = k % box_n;
        if (k == 0) {
            return head;
        }
        int steps = box.n - k;
        ListNode cur = head;
        for (int i = 1; i < steps; i++) {
            cur = cur.next;
        }
        ListNode newHead = cur.next;
        cur.next = null;
        box_tail.next = head;
        return newHead;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

int rotateRight_count(ListNode* node) {
    if (!node) {
        return;
    }
    box_n++;
    box_tail = node;
    rotateRight_count(node->next);
}

ListNode* rotateRight(ListNode* head, int k) {
    if (!head || !head->next) {
        return head;
    }
    int box_n = 0;
    ListNode* box_tail = nullptr;
    rotateRight_count(head);
    k = k % box_n;
    if (k == 0) {
        return head;
    }
    int steps = box.n - k;
    ListNode* cur = head;
    for (int i = 1; i < steps; i++) {
        cur = cur->next;
    }
    ListNode* newHead = cur->next;
    cur->next = nullptr;
    box_tail->next = head;
    return newHead;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

int rotateRight_count(struct Node* node) {
    if (!node) {
        return;
    }
    box_n++;
    box_tail = node;
    rotateRight_count(node->next);
}

struct Node* rotateRight(struct Node* head, int k) {
    if (!head || !head->next) {
        return head;
    }
    int box_n = 0;
    struct Node* box_tail = NULL;
    rotateRight_count(head);
    k = k % box_n;
    if (k == 0) {
        return head;
    }
    int steps = box.n - k;
    struct Node* cur = head;
    for (int i = 1; i < steps; i++) {
        cur = cur->next;
    }
    struct Node* newHead = cur->next;
    cur->next = NULL;
    box_tail->next = head;
    return newHead;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Find tail and n in one walk, close the ring, walk n - k % n steps from head, cut. Constant extra space, one extra pass after the count.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function rotateRight(head, k) {
  if (!head || !head.next) return head;
  let n = 1;
  let tail = head;
  while (tail.next) {
    tail = tail.next;
    n++;
  }
  k = k % n;
  if (k === 0) return head;
  tail.next = head;
  let steps = n - k;
  let newTail = head;
  for (let i = 1; i < steps; i++) newTail = newTail.next;
  const newHead = newTail.next;
  newTail.next = null;
  return newHead;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function rotateRight(head, k) {
  if (!head || !head.next) return head;
  let n = 1;
  let tail = head;
  while (tail.next) {
    tail = tail.next;
    n++;
  }
  k = k % n;
  if (k === 0) return head;
  tail.next = head;
  let steps = n - k;
  let newTail = head;
  for (let i = 1; i < steps; i++) newTail = newTail.next;
  const newHead = newTail.next;
  newTail.next = null;
  return newHead;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def rotateRight(head, k):
    if not head  or  not head.next:
        return head
    n = 1
    tail = head
    while tail.next:
        tail = tail.next
        n += 1
    k = k % n
    if k == 0:
        return head
    tail.next = head
    steps = n - k
    newTail = head
    for i in range(1, steps):
        newTail = newTail.next
    newHead = newTail.next
    newTail.next = None
    return newHead`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode rotateRight(ListNode head, int k) {
        if (head == null || head.next == null) {
            return head;
        }
        int n = 1;
        ListNode tail = head;
        while (tail.next != null) {
            tail = tail.next;
            n++;
        }
        k = k % n;
        if (k == 0) {
            return head;
        }
        tail.next = head;
        int steps = n - k;
        ListNode newTail = head;
        for (int i = 1; i < steps; i++) {
            newTail = newTail.next;
        }
        ListNode newHead = newTail.next;
        newTail.next = null;
        return newHead;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* rotateRight(ListNode* head, int k) {
    if (!head || !head->next) {
        return head;
    }
    int n = 1;
    ListNode* tail = head;
    while (tail->next) {
        tail = tail->next;
        n++;
    }
    k = k % n;
    if (k == 0) {
        return head;
    }
    tail->next = head;
    int steps = n - k;
    ListNode* newTail = head;
    for (int i = 1; i < steps; i++) {
        newTail = newTail->next;
    }
    ListNode* newHead = newTail->next;
    newTail->next = nullptr;
    return newHead;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* rotateRight(struct Node* head, int k) {
    if (!head || !head->next) {
        return head;
    }
    int n = 1;
    struct Node* tail = head;
    while (tail->next) {
        tail = tail->next;
        n++;
    }
    k = k % n;
    if (k == 0) {
        return head;
    }
    tail->next = head;
    int steps = n - k;
    struct Node* newTail = head;
    for (int i = 1; i < steps; i++) {
        newTail = newTail->next;
    }
    struct Node* newHead = newTail->next;
    newTail->next = NULL;
    return newHead;
}`
          }
        }
      ]
    },
    {
      id: 16,
      level: "intermediate",
      q: "Flatten a Multilevel Doubly Linked List",
      ask: "Amazon · Microsoft · Meta · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/flattening-a-linked-list/1"}],
      a: "Each node has prev, next, and child. Child is the head of another doubly list. Flatten so you get a single-level list in preorder: node, then its child list, then its old next. All child pointers become null. prev/next stay consistent.\n\n1-2-3 with 3's child 7-8 becomes 1-2-3-7-8 with no children.\n\nDFS into an array then relink. Recursion flattens a child and splices it. Iteration finds the child's tail and splices without a call stack.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "DFS preorder into an array (node, child, next). Then walk the array and set next/prev, clear child. Extra array of every node.",
          code: `function Node(val, prev, next, child) {
  this.val = val;
  this.prev = prev;
  this.next = next;
  this.child = child;
}

function flatten(head) {
  const nodes = [];
  function dfs(node) {
    while (node) {
      nodes.push(node);
      if (node.child) dfs(node.child);
      node = node.next;
    }
  }
  dfs(head);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].prev = i === 0 ? null : nodes[i - 1];
    nodes[i].next = i === nodes.length - 1 ? null : nodes[i + 1];
    nodes[i].child = null;
  }
  return nodes[0] || null;
}`,
          codes: {
            javascript: `function Node(val, prev, next, child) {
  this.val = val;
  this.prev = prev;
  this.next = next;
  this.child = child;
}

function flatten(head) {
  const nodes = [];
  function dfs(node) {
    while (node) {
      nodes.push(node);
      if (node.child) dfs(node.child);
      node = node.next;
    }
  }
  dfs(head);
  for (let i = 0; i < nodes.length; i++) {
    nodes[i].prev = i === 0 ? null : nodes[i - 1];
    nodes[i].next = i === nodes.length - 1 ? null : nodes[i + 1];
    nodes[i].child = null;
  }
  return nodes[0] || null;
}`,
            python: `class Node:
    def __init__(self, val=0, prev=None, next=None, child=None):
        self.val = val
        self.prev = prev
        self.next = next
        self.child = child
def flatten(head):
    nodes = []
    def dfs(node):
        while node:
            nodes.append(node)
            if node.child:
                dfs(node.child)
            node = node.next
    dfs(head)
    for i in range(len(nodes)):
        nodes[i].prev = i =(None if = 0 else nodes[i - 1])
        nodes[i].next = i =(None if = len(nodes) - 1 else nodes[i + 1])
        nodes[i].child = None
    return nodes[0]  or  None`,
            java: `import java.util.*;

class Node {
    int val;
    Node prev;
    Node next;
    Node child;
    Node(int val, Node prev, Node next, Node child) {
        this.val = val; this.prev = prev; this.next = next; this.child = child;
    }
}

class Solution {
    private Node flatten_dfs(Node node) {
        while (node != null) {
            nodes.add(node);
            if (node.child != null) {
                flatten_dfs(node.child);
            }
            node = node.next;
        }
    }

    public Node flatten(Node head) {
        List<Node> nodes = new ArrayList<>();
        flatten_dfs(head);
        for (int i = 0; i < nodes.size(); i++) {
            nodes[i].prev = i == 0 ? null : nodes[i - 1];
            nodes[i].next = i == nodes.size() - 1 ? null : nodes[i + 1];
            nodes[i].child = null;
        }
        return nodes[0] || null;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* prev;
    Node* next;
    Node* child;
    Node(int x, Node* prev, Node* next, Node* child) : val(x), prev(prev), next(next), child(child) {}
};

Node* flatten_dfs(Node* node) {
    while (node) {
        nodes.push_back(node);
        if (node->child) {
            flatten_dfs(node->child);
        }
        node = node->next;
    }
}

Node* flatten(Node* head) {
    vector<Node*> nodes;
    flatten_dfs(head);
    for (int i = 0; i < nodes.size(); i++) {
        nodes[i].prev = i == 0 ? nullptr : nodes[i - 1];
        nodes[i].next = i == nodes.size() - 1 ? nullptr : nodes[i + 1];
        nodes[i].child = nullptr;
    }
    return nodes[0] || nullptr;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* prev;
    struct Node* next;
    struct Node* child;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->prev = NULL;
    n->next = NULL;
    n->child = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* flatten_dfs(struct Node* node) {
    while (node) {
        nodes[nodesn++] = node;
        if (node->child) {
            flatten_dfs(node->child);
        }
        node = node->next;
    }
}

struct Node* flatten(struct Node* head) {
    struct Node* nodes[10005]; int nodesn = 0;
    flatten_dfs(head);
    for (int i = 0; i < nodesn; i++) {
        nodes[i].prev = i == 0 ? NULL : nodes[i - 1];
        nodes[i].next = i == nodesn - 1 ? NULL : nodes[i + 1];
        nodes[i].child = NULL;
    }
    return nodes[0] || NULL;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Recurse: if a node has a child, flatten the child, hang it after the node, find the child's tail, attach the old next. Stack depth follows nesting.",
          code: `function Node(val, prev, next, child) {
  this.val = val;
  this.prev = prev;
  this.next = next;
  this.child = child;
}

function flatten(head) {
  function go(node) {
    let cur = node;
    let last = node;
    while (cur) {
      const next = cur.next;
      if (cur.child) {
        const childLast = go(cur.child);
        cur.next = cur.child;
        cur.child.prev = cur;
        cur.child = null;
        if (childLast) {
          childLast.next = next;
          if (next) next.prev = childLast;
          last = childLast;
        }
      } else {
        last = cur;
      }
      cur = next;
    }
    return last;
  }
  go(head);
  return head;
}`,
          codes: {
            javascript: `function Node(val, prev, next, child) {
  this.val = val;
  this.prev = prev;
  this.next = next;
  this.child = child;
}

function flatten(head) {
  function go(node) {
    let cur = node;
    let last = node;
    while (cur) {
      const next = cur.next;
      if (cur.child) {
        const childLast = go(cur.child);
        cur.next = cur.child;
        cur.child.prev = cur;
        cur.child = null;
        if (childLast) {
          childLast.next = next;
          if (next) next.prev = childLast;
          last = childLast;
        }
      } else {
        last = cur;
      }
      cur = next;
    }
    return last;
  }
  go(head);
  return head;
}`,
            python: `class Node:
    def __init__(self, val=0, prev=None, next=None, child=None):
        self.val = val
        self.prev = prev
        self.next = next
        self.child = child
def flatten(head):
    def go(node):
        cur = node
        last = node
        while cur:
            next = cur.next
            if cur.child:
                childLast = go(cur.child)
                cur.next = cur.child
                cur.child.prev = cur
                cur.child = None
                if childLast:
                    childLast.next = next
                    if next:
                        next.prev = childLast
                    last = childLast
            else:
                last = cur
            cur = next
        return last
    go(head)
    return head`,
            java: `import java.util.*;

class Node {
    int val;
    Node prev;
    Node next;
    Node child;
    Node(int val, Node prev, Node next, Node child) {
        this.val = val; this.prev = prev; this.next = next; this.child = child;
    }
}

class Solution {
    private Node flatten_go(Node node) {
        Node cur = node;
        Node last = node;
        while (cur != null) {
            Node next = cur.next;
            if (cur.child != null) {
                Node childLast = flatten_go(cur.child);
                cur.next = cur.child;
                cur.child.prev = cur;
                cur.child = null;
                if (childLast != null) {
                    childLast.next = next;
                    if (next != null) {
                        next.prev = childLast;
                    }
                    last = childLast;
                }
            }
            else {
                last = cur;
            }
            cur = next;
        }
        return last;
    }

    public Node flatten(Node head) {
        flatten_go(head);
        return head;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* prev;
    Node* next;
    Node* child;
    Node(int x, Node* prev, Node* next, Node* child) : val(x), prev(prev), next(next), child(child) {}
};

Node* flatten_go(Node* node) {
    Node* cur = node;
    Node* last = node;
    while (cur) {
        Node* next = cur->next;
        if (cur->child) {
            Node* childLast = flatten_go(cur->child);
            cur->next = cur->child;
            cur->child.prev = cur;
            cur->child = nullptr;
            if (childLast) {
                childLast->next = next;
                if (next) {
                    next->prev = childLast;
                }
                last = childLast;
            }
        }
        else {
            last = cur;
        }
        cur = next;
    }
    return last;
}

Node* flatten(Node* head) {
    flatten_go(head);
    return head;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* prev;
    struct Node* next;
    struct Node* child;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->prev = NULL;
    n->next = NULL;
    n->child = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* flatten_go(struct Node* node) {
    struct Node* cur = node;
    struct Node* last = node;
    while (cur) {
        struct Node* next = cur->next;
        if (cur->child) {
            struct Node* childLast = flatten_go(cur->child);
            cur->next = cur->child;
            cur->child.prev = cur;
            cur->child = NULL;
            if (childLast) {
                childLast->next = next;
                if (next) {
                    next->prev = childLast;
                }
                last = childLast;
            }
        }
        else {
            last = cur;
        }
        cur = next;
    }
    return last;
}

struct Node* flatten(struct Node* head) {
    flatten_go(head);
    return head;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "Walk with one pointer. On a child, find that child's current tail (no recurse), splice the whole child between cur and cur.next, clear child. Then continue. Auxiliary space O(1).",
          code: `function Node(val, prev, next, child) {
  this.val = val;
  this.prev = prev;
  this.next = next;
  this.child = child;
}

function flatten(head) {
  let cur = head;
  while (cur) {
    if (cur.child) {
      let tail = cur.child;
      while (tail.next) tail = tail.next;
      tail.next = cur.next;
      if (cur.next) cur.next.prev = tail;
      cur.next = cur.child;
      cur.child.prev = cur;
      cur.child = null;
    }
    cur = cur.next;
  }
  return head;
}`,
          codes: {
            javascript: `function Node(val, prev, next, child) {
  this.val = val;
  this.prev = prev;
  this.next = next;
  this.child = child;
}

function flatten(head) {
  let cur = head;
  while (cur) {
    if (cur.child) {
      let tail = cur.child;
      while (tail.next) tail = tail.next;
      tail.next = cur.next;
      if (cur.next) cur.next.prev = tail;
      cur.next = cur.child;
      cur.child.prev = cur;
      cur.child = null;
    }
    cur = cur.next;
  }
  return head;
}`,
            python: `class Node:
    def __init__(self, val=0, prev=None, next=None, child=None):
        self.val = val
        self.prev = prev
        self.next = next
        self.child = child
def flatten(head):
    cur = head
    while cur:
        if cur.child:
            tail = cur.child
            while tail.next:
                tail = tail.next
            tail.next = cur.next
            if cur.next:
                cur.next.prev = tail
            cur.next = cur.child
            cur.child.prev = cur
            cur.child = None
        cur = cur.next
    return head`,
            java: `import java.util.*;

class Node {
    int val;
    Node prev;
    Node next;
    Node child;
    Node(int val, Node prev, Node next, Node child) {
        this.val = val; this.prev = prev; this.next = next; this.child = child;
    }
}

class Solution {
    public Node flatten(Node head) {
        Node cur = head;
        while (cur != null) {
            if (cur.child != null) {
                Node tail = cur.child;
                while (tail.next != null) {
                    tail = tail.next;
                }
                tail.next = cur.next;
                if (cur.next != null) {
                    cur.next.prev = tail;
                }
                cur.next = cur.child;
                cur.child.prev = cur;
                cur.child = null;
            }
            cur = cur.next;
        }
        return head;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct Node {
    int val;
    Node* prev;
    Node* next;
    Node* child;
    Node(int x, Node* prev, Node* next, Node* child) : val(x), prev(prev), next(next), child(child) {}
};

Node* flatten(Node* head) {
    Node* cur = head;
    while (cur) {
        if (cur->child) {
            Node* tail = cur->child;
            while (tail->next) {
                tail = tail->next;
            }
            tail->next = cur->next;
            if (cur->next) {
                cur->next.prev = tail;
            }
            cur->next = cur->child;
            cur->child.prev = cur;
            cur->child = nullptr;
        }
        cur = cur->next;
    }
    return head;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* prev;
    struct Node* next;
    struct Node* child;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->prev = NULL;
    n->next = NULL;
    n->child = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* flatten(struct Node* head) {
    struct Node* cur = head;
    while (cur) {
        if (cur->child) {
            struct Node* tail = cur->child;
            while (tail->next) {
                tail = tail->next;
            }
            tail->next = cur->next;
            if (cur->next) {
                cur->next.prev = tail;
            }
            cur->next = cur->child;
            cur->child.prev = cur;
            cur->child = NULL;
        }
        cur = cur->next;
    }
    return head;
}`
          }
        }
      ]
    },
    {
      id: 17,
      level: "intermediate",
      q: "Odd Even Linked List",
      ask: "Amazon · Microsoft · Adobe · Apple",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/odd-even-linked-list/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/odd-even-linked-list/"}],
      a: "Group all odd-indexed nodes, then all even-indexed nodes. Index starts at 1 for the head. Relative order inside each group stays the same. Do it in O(1) extra space.\n\n1 -> 2 -> 3 -> 4 -> 5 becomes 1 -> 3 -> 5 -> 2 -> 4.\n\nTwo arrays of nodes, then concat. Recursion can rewire odd/even. Iteration keeps odd and even tails and stitches evenHead at the end of odds.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n)",
          space: "O(n)",
          why: "Push odd-position nodes, then even-position nodes, into arrays. Relink in that order. Extra arrays.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function oddEvenList(head) {
  const odds = [];
  const evens = [];
  let cur = head;
  let i = 1;
  while (cur) {
    if (i % 2 === 1) odds.push(cur);
    else evens.push(cur);
    cur = cur.next;
    i++;
  }
  const nodes = odds.concat(evens);
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const node of nodes) {
    tail.next = node;
    tail = tail.next;
  }
  tail.next = null;
  return dummy.next;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function oddEvenList(head) {
  const odds = [];
  const evens = [];
  let cur = head;
  let i = 1;
  while (cur) {
    if (i % 2 === 1) odds.push(cur);
    else evens.push(cur);
    cur = cur.next;
    i++;
  }
  const nodes = odds.concat(evens);
  const dummy = new ListNode(0);
  let tail = dummy;
  for (const node of nodes) {
    tail.next = node;
    tail = tail.next;
  }
  tail.next = null;
  return dummy.next;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def oddEvenList(head):
    odds = []
    evens = []
    cur = head
    i = 1
    while cur:
        if i % 2 == 1:
            odds.append(cur)
        else:
            evens.append(cur)
        cur = cur.next
        i += 1
    nodes = (odds + evens)
    dummy = ListNode(0)
    tail = dummy
    for node in nodes:
        tail.next = node
        tail = tail.next
    tail.next = None
    return dummy.next`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode oddEvenList(ListNode head) {
        List<ListNode> odds = new ArrayList<>();
        List<ListNode> evens = new ArrayList<>();
        ListNode cur = head;
        int i = 1;
        while (cur != null) {
            if (i % 2 == 1) {
                odds.add(cur);
            }
            else {
                evens.add(cur);
            }
            cur = cur.next;
            i++;
        }
        int nodes = concat(odds, evens);
        ListNode dummy = new ListNode(0);
        ListNode tail = dummy;
        for (var node : nodes) {
            tail.next = node;
            tail = tail.next;
        }
        tail.next = null;
        return dummy.next;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* oddEvenList(ListNode* head) {
    vector<ListNode*> odds;
    vector<ListNode*> evens;
    ListNode* cur = head;
    int i = 1;
    while (cur) {
        if (i % 2 == 1) {
            odds.push_back(cur);
        }
        else {
            evens.push_back(cur);
        }
        cur = cur->next;
        i++;
    }
    int nodes = concat(odds, evens);
    ListNode* dummy = new ListNode(0);
    ListNode* tail = dummy;
    for (auto node : nodes) {
        tail->next = node;
        tail = tail->next;
    }
    tail->next = nullptr;
    return dummy->next;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* oddEvenList(struct Node* head) {
    struct Node* odds[10005]; int oddsn = 0;
    struct Node* evens[10005]; int evensn = 0;
    struct Node* cur = head;
    int i = 1;
    while (cur) {
        if (i % 2 == 1) {
            odds[oddsn++] = cur;
        }
        else {
            evens[evensn++] = cur;
        }
        cur = cur->next;
        i++;
    }
    int nodes = concat(odds, evens);
    struct Node* dummy = newNode(0);
    struct Node* tail = dummy;
    for (int _i = 0; _i < nodesn; _i++) { struct Node* node = nodes[_i];
        tail->next = node;
        tail = tail->next;
    }
    tail->next = NULL;
    return dummy->next;
}`
          }
        },
        {
          name: "Optimal",
          time: "O(n)",
          space: "O(n)",
          why: "Recursive rewire: odd.next = even.next, even.next = that node's next, then recurse. Attach evenHead when even runs out. Stack O(n).",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function oddEvenList(head) {
  if (!head || !head.next) return head;
  const evenHead = head.next;
  function go(odd, even) {
    if (!even || !even.next) {
      odd.next = evenHead;
      return;
    }
    odd.next = even.next;
    even.next = odd.next.next;
    go(odd.next, even.next);
  }
  go(head, evenHead);
  return head;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function oddEvenList(head) {
  if (!head || !head.next) return head;
  const evenHead = head.next;
  function go(odd, even) {
    if (!even || !even.next) {
      odd.next = evenHead;
      return;
    }
    odd.next = even.next;
    even.next = odd.next.next;
    go(odd.next, even.next);
  }
  go(head, evenHead);
  return head;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def oddEvenList(head):
    if not head  or  not head.next:
        return head
    evenHead = head.next
    def go(odd, even):
        if not even  or  not even.next:
            odd.next = evenHead
            return
        odd.next = even.next
        even.next = odd.next.next
        go(odd.next, even.next)
    go(head, evenHead)
    return head`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    private ListNode oddEvenList_go(int odd, int even) {
        if (even == null || even.next == null) {
            odd.next = evenHead;
            return;
        }
        odd.next = even.next;
        even.next = odd.next.next;
        oddEvenList_go(odd.next, even.next);
    }

    public ListNode oddEvenList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode evenHead = head.next;
        oddEvenList_go(head, evenHead);
        return head;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* oddEvenList_go(int odd, int even) {
    if (!even || !even->next) {
        odd->next = evenHead;
        return;
    }
    odd->next = even->next;
    even->next = odd->next.next;
    oddEvenList_go(odd->next, even->next);
}

ListNode* oddEvenList(ListNode* head) {
    if (!head || !head->next) {
        return head;
    }
    ListNode* evenHead = head->next;
    oddEvenList_go(head, evenHead);
    return head;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* oddEvenList_go(int odd, int even) {
    if (!even || !even->next) {
        odd->next = evenHead;
        return;
    }
    odd->next = even->next;
    even->next = odd->next.next;
    oddEvenList_go(odd->next, even->next);
}

struct Node* oddEvenList(struct Node* head) {
    if (!head || !head->next) {
        return head;
    }
    struct Node* evenHead = head->next;
    oddEvenList_go(head, evenHead);
    return head;
}`
          }
        },
        {
          name: "More optimal",
          time: "O(n)",
          space: "O(1)",
          why: "odd and even pointers. odd.next = odd.next.next, even.next = even.next.next, until even is exhausted. odd.next = evenHead. In-place, constant extra space.",
          code: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function oddEvenList(head) {
  if (!head || !head.next) return head;
  let odd = head;
  let even = head.next;
  const evenHead = even;
  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
  }
  odd.next = evenHead;
  return head;
}`,
          codes: {
            javascript: `function ListNode(val, next) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}

function oddEvenList(head) {
  if (!head || !head.next) return head;
  let odd = head;
  let even = head.next;
  const evenHead = even;
  while (even && even.next) {
    odd.next = even.next;
    odd = odd.next;
    even.next = odd.next;
    even = even.next;
  }
  odd.next = evenHead;
  return head;
}`,
            python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
def oddEvenList(head):
    if not head  or  not head.next:
        return head
    odd = head
    even = head.next
    evenHead = even
    while even  and  even.next:
        odd.next = even.next
        odd = odd.next
        even.next = odd.next
        even = even.next
    odd.next = evenHead
    return head`,
            java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public ListNode oddEvenList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode odd = head;
        ListNode even = head.next;
        ListNode evenHead = even;
        while (even != null && even.next != null) {
            odd.next = even.next;
            odd = odd.next;
            even.next = odd.next;
            even = even.next;
        }
        odd.next = evenHead;
        return head;
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode* next) : val(x), next(next) {}
};

ListNode* oddEvenList(ListNode* head) {
    if (!head || !head->next) {
        return head;
    }
    ListNode* odd = head;
    ListNode* even = head->next;
    ListNode* evenHead = even;
    while (even && even->next) {
        odd->next = even->next;
        odd = odd->next;
        even->next = odd->next;
        even = even->next;
    }
    odd->next = evenHead;
    return head;
}`,
            c: `#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>

struct Node {
    int val;
    struct Node* next;
};

struct Node* newNode(int val) {
    struct Node* n = (struct Node*)malloc(sizeof(struct Node));
    n->val = val;
    n->next = NULL;
    return n;
}

#define MAX(a,b) ((a)>(b)?(a):(b))
#define MIN(a,b) ((a)<(b)?(a):(b))

int containsPtr(struct Node** a, int n, struct Node* x) {
    for (int i = 0; i < n; i++) if (a[i] == x) return 1;
    return 0;
}

struct Node* oddEvenList(struct Node* head) {
    if (!head || !head->next) {
        return head;
    }
    struct Node* odd = head;
    struct Node* even = head->next;
    struct Node* evenHead = even;
    while (even && even->next) {
        odd->next = even->next;
        odd = odd->next;
        even->next = odd->next;
        even = even->next;
    }
    odd->next = evenHead;
    return head;
}`
          }
        }
      ]
    },
    {
      id: 18,
      level: "advanced",
      q: "LRU Cache",
      ask: "Google · Amazon · Microsoft · Uber",
      links: [{"name":"LeetCode","url":"https://leetcode.com/problems/lru-cache/"},{"name":"GFG","url":"https://www.geeksforgeeks.org/problems/lru-cache-page-replacement/1"}],
      a: "Implement LRUCache(capacity), get(key), and put(key, value). get returns the value or -1. Both get and put count as use, so that key becomes most recently used. When capacity is full, put evicts the least recently used key. Target O(1) for get and put.\n\ncapacity 2: put(1,1), put(2,2), get(1) is 1, put(3,3) drops key 2, get(2) is -1.\n\nAn array you scan and move is O(n). A JavaScript Map is insertion-ordered: delete plus set moves a key to the newest end. The interview structure is a hashmap of key to node plus a doubly linked list of recency.\n\nUse the Brute, Optimal, and More optimal tabs for the three codes.",
      solutions: [
        {
          name: "Brute",
          time: "O(n) get/put",
          space: "O(capacity)",
          why: "Store pairs in an array. get scans, splices the hit to the end. put updates or appends, then shift if over capacity. Simple, linear per operation.",
          code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.data = [];
  }

  get(key) {
    const i = this.data.findIndex((x) => x.key === key);
    if (i < 0) return -1;
    const item = this.data.splice(i, 1)[0];
    this.data.push(item);
    return item.value;
  }

  put(key, value) {
    const i = this.data.findIndex((x) => x.key === key);
    if (i >= 0) this.data.splice(i, 1);
    this.data.push({ key: key, value: value });
    if (this.data.length > this.capacity) this.data.shift();
  }
}`,
          codes: {
            javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.data = [];
  }

  get(key) {
    const i = this.data.findIndex((x) => x.key === key);
    if (i < 0) return -1;
    const item = this.data.splice(i, 1)[0];
    this.data.push(item);
    return item.value;
  }

  put(key, value) {
    const i = this.data.findIndex((x) => x.key === key);
    if (i >= 0) this.data.splice(i, 1);
    this.data.push({ key: key, value: value });
    if (this.data.length > this.capacity) this.data.shift();
  }
}`,
            python: `class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.data = []

    def get(self, key):
        i = -1
        for idx, x in enumerate(self.data):
            if x["key"] == key:
                i = idx
                break
        if i < 0:
            return -1
        item = self.data.pop(i)
        self.data.append(item)
        return item["value"]

    def put(self, key, value):
        i = -1
        for idx, x in enumerate(self.data):
            if x["key"] == key:
                i = idx
                break
        if i >= 0:
            self.data.pop(i)
        self.data.append({"key": key, "value": value})
        if len(self.data) > self.capacity:
            self.data.pop(0)`,
            java: `import java.util.*;

class LRUCache {
    private int capacity;
    private List<int[]> data;
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.data = new ArrayList<>();
    }
    public int get(int key) {
        int i = -1;
        for (int idx = 0; idx < data.size(); idx++) {
            if (data.get(idx)[0] == key) { i = idx; break; }
        }
        if (i < 0) return -1;
        int[] item = data.remove(i);
        data.add(item);
        return item[1];
    }
    public void put(int key, int value) {
        int i = -1;
        for (int idx = 0; idx < data.size(); idx++) {
            if (data.get(idx)[0] == key) { i = idx; break; }
        }
        if (i >= 0) data.remove(i);
        data.add(new int[]{key, value});
        if (data.size() > capacity) data.remove(0);
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

class LRUCache {
    int capacity;
    vector<pair<int,int>> data;
public:
    LRUCache(int capacity) : capacity(capacity) {}
    int get(int key) {
        int i = -1;
        for (int idx = 0; idx < (int)data.size(); idx++) {
            if (data[idx].first == key) { i = idx; break; }
        }
        if (i < 0) return -1;
        pair<int,int> item = data[i];
        data.erase(data.begin() + i);
        data.push_back(item);
        return item.second;
    }
    void put(int key, int value) {
        int i = -1;
        for (int idx = 0; idx < (int)data.size(); idx++) {
            if (data[idx].first == key) { i = idx; break; }
        }
        if (i >= 0) data.erase(data.begin() + i);
        data.push_back({key, value});
        if ((int)data.size() > capacity) data.erase(data.begin());
    }
};`,
            c: `#include <stdlib.h>

typedef struct { int key; int value; } Pair;

typedef struct {
    int capacity;
    Pair data[10005];
    int n;
} LRUCache;

void lruInit(LRUCache* c, int capacity) {
    c->capacity = capacity;
    c->n = 0;
}

int lruGet(LRUCache* c, int key) {
    int i = -1;
    for (int idx = 0; idx < c->n; idx++) {
        if (c->data[idx].key == key) { i = idx; break; }
    }
    if (i < 0) return -1;
    Pair item = c->data[i];
    for (int j = i; j < c->n - 1; j++) c->data[j] = c->data[j + 1];
    c->data[c->n - 1] = item;
    return item.value;
}

void lruPut(LRUCache* c, int key, int value) {
    int i = -1;
    for (int idx = 0; idx < c->n; idx++) {
        if (c->data[idx].key == key) { i = idx; break; }
    }
    if (i >= 0) {
        for (int j = i; j < c->n - 1; j++) c->data[j] = c->data[j + 1];
        c->n--;
    }
    c->data[c->n].key = key;
    c->data[c->n].value = value;
    c->n++;
    if (c->n > c->capacity) {
        for (int j = 0; j < c->n - 1; j++) c->data[j] = c->data[j + 1];
        c->n--;
    }
}`
          }
        },
        {
          name: "Optimal",
          time: "O(1) get/put",
          space: "O(capacity)",
          why: "Map keeps insertion order. On get/put, delete then set so the key is newest. Evict map.keys().next().value, the oldest. O(1) amortized in modern JS engines.",
          code: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}`,
          codes: {
            javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const value = this.map.get(key);
    this.map.delete(key);
    this.map.set(key, value);
    return value;
  }

  put(key, value) {
    if (this.map.has(key)) this.map.delete(key);
    this.map.set(key, value);
    if (this.map.size > this.capacity) {
      const oldest = this.map.keys().next().value;
      this.map.delete(oldest);
    }
  }
}`,
            python: `class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.map = {}
        self.order = []

    def get(self, key):
        if key not in self.map:
            return -1
        value = self.map[key]
        self.order.remove(key)
        self.order.append(key)
        return value

    def put(self, key, value):
        if key in self.map:
            self.order.remove(key)
        self.map[key] = value
        self.order.append(key)
        if len(self.map) > self.capacity:
            oldest = self.order.pop(0)
            del self.map[oldest]`,
            java: `import java.util.*;

class LRUCache {
    private int capacity;
    private LinkedHashMap<Integer, Integer> map;
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new LinkedHashMap<>(capacity, 0.75f, true);
    }
    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        int value = map.get(key);
        map.remove(key);
        map.put(key, value);
        return value;
    }
    public void put(int key, int value) {
        if (map.containsKey(key)) map.remove(key);
        map.put(key, value);
        if (map.size() > capacity) {
            Integer oldest = map.keySet().iterator().next();
            map.remove(oldest);
        }
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

class LRUCache {
    int capacity;
    list<pair<int,int>> order;
    unordered_map<int, list<pair<int,int>>::iterator> map;
public:
    LRUCache(int capacity) : capacity(capacity) {}
    int get(int key) {
        if (!map.count(key)) return -1;
        auto it = map[key];
        int value = it->second;
        order.erase(it);
        order.push_front({key, value});
        map[key] = order.begin();
        return value;
    }
    void put(int key, int value) {
        if (map.count(key)) {
            order.erase(map[key]);
            map.erase(key);
        }
        order.push_front({key, value});
        map[key] = order.begin();
        if ((int)map.size() > capacity) {
            auto oldest = order.back();
            map.erase(oldest.first);
            order.pop_back();
        }
    }
};`,
            c: `#include <stdlib.h>

typedef struct Item {
    int key;
    int value;
    struct Item* prev;
    struct Item* next;
} Item;

#define TAB 4099

typedef struct {
    int capacity;
    int size;
    Item* head;
    Item* tail;
    Item* table[TAB];
} LRUCache;

static unsigned hkey(int k) { return ((unsigned)k * 2654435761u) % TAB; }

static Item* find(LRUCache* c, int key) {
    for (Item* p = c->table[hkey(key)]; p; p = p->next) {
        /* linear list is recency; table is not chained by key — scan recency list */
    }
    for (Item* p = c->head; p; p = p->next) if (p->key == key) return p;
    return NULL;
}

void lruInit(LRUCache* c, int capacity) {
    c->capacity = capacity;
    c->size = 0;
    c->head = c->tail = NULL;
}

int lruGet(LRUCache* c, int key) {
    Item* p = find(c, key);
    if (!p) return -1;
    if (p != c->tail) {
        if (p->prev) p->prev->next = p->next;
        if (p->next) p->next->prev = p->prev;
        if (p == c->head) c->head = p->next;
        p->prev = c->tail;
        p->next = NULL;
        if (c->tail) c->tail->next = p;
        c->tail = p;
        if (!c->head) c->head = p;
    }
    return p->value;
}

void lruPut(LRUCache* c, int key, int value) {
    Item* p = find(c, key);
    if (p) {
        p->value = value;
        lruGet(c, key);
        return;
    }
    Item* n = (Item*)malloc(sizeof(Item));
    n->key = key; n->value = value; n->prev = c->tail; n->next = NULL;
    if (c->tail) c->tail->next = n; else c->head = n;
    c->tail = n;
    c->size++;
    if (c->size > c->capacity) {
        Item* old = c->head;
        c->head = old->next;
        if (c->head) c->head->prev = NULL;
        else c->tail = NULL;
        free(old);
        c->size--;
    }
}`
          }
        },
        {
          name: "More optimal",
          time: "O(1) get/put",
          space: "O(capacity)",
          why: "Classic interview design: Map from key to node, plus sentinel doubly linked list. Most recent after head, LRU before tail. Move-to-front on get/put. Evict tail.prev. Shows O(1) without relying on Map order.",
          code: `function DNode(key, val) {
  this.key = key;
  this.val = val;
  this.prev = null;
  this.next = null;
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new DNode(0, 0);
    this.tail = new DNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _add(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._add(node);
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this._remove(this.map.get(key));
      this.map.delete(key);
    }
    const node = new DNode(key, value);
    this._add(node);
    this.map.set(key, node);
    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}`,
          codes: {
            javascript: `function DNode(key, val) {
  this.key = key;
  this.val = val;
  this.prev = null;
  this.next = null;
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new DNode(0, 0);
    this.tail = new DNode(0, 0);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _add(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this._remove(node);
    this._add(node);
    return node.val;
  }

  put(key, value) {
    if (this.map.has(key)) {
      this._remove(this.map.get(key));
      this.map.delete(key);
    }
    const node = new DNode(key, value);
    this._add(node);
    this.map.set(key, node);
    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
    }
  }
}`,
            python: `class DNode:
    def __init__(self, key=0, val=0):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.map = {}
        self.head = DNode(0, 0)
        self.tail = DNode(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _add(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def get(self, key):
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._add(node)
        return node.val

    def put(self, key, value):
        if key in self.map:
            self._remove(self.map[key])
            del self.map[key]
        node = DNode(key, value)
        self._add(node)
        self.map[key] = node
        if len(self.map) > self.capacity:
            lru = self.tail.prev
            self._remove(lru)
            del self.map[lru.key]`,
            java: `import java.util.*;

class DNode {
    int key;
    int val;
    DNode prev;
    DNode next;
    DNode(int key, int val) { this.key = key; this.val = val; }
}

class LRUCache {
    private int capacity;
    private Map<Integer, DNode> map;
    private DNode head, tail;
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        head = new DNode(0, 0);
        tail = new DNode(0, 0);
        head.next = tail;
        tail.prev = head;
    }
    private void add(DNode node) {
        node.next = head.next;
        node.prev = head;
        head.next.prev = node;
        head.next = node;
    }
    private void remove(DNode node) {
        node.prev.next = node.next;
        node.next.prev = node.prev;
    }
    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        DNode node = map.get(key);
        remove(node);
        add(node);
        return node.val;
    }
    public void put(int key, int value) {
        if (map.containsKey(key)) {
            remove(map.get(key));
            map.remove(key);
        }
        DNode node = new DNode(key, value);
        add(node);
        map.put(key, node);
        if (map.size() > capacity) {
            DNode lru = tail.prev;
            remove(lru);
            map.remove(lru.key);
        }
    }
}`,
            cpp: `#include <bits/stdc++.h>
using namespace std;

struct DNode {
    int key, val;
    DNode* prev;
    DNode* next;
    DNode(int k, int v) : key(k), val(v), prev(nullptr), next(nullptr) {}
};

class LRUCache {
    int capacity;
    unordered_map<int, DNode*> map;
    DNode* head;
    DNode* tail;
    void add(DNode* node) {
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
    }
    void remove(DNode* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }
public:
    LRUCache(int capacity) : capacity(capacity) {
        head = new DNode(0, 0);
        tail = new DNode(0, 0);
        head->next = tail;
        tail->prev = head;
    }
    int get(int key) {
        if (!map.count(key)) return -1;
        DNode* node = map[key];
        remove(node);
        add(node);
        return node->val;
    }
    void put(int key, int value) {
        if (map.count(key)) {
            remove(map[key]);
            map.erase(key);
        }
        DNode* node = new DNode(key, value);
        add(node);
        map[key] = node;
        if ((int)map.size() > capacity) {
            DNode* lru = tail->prev;
            remove(lru);
            map.erase(lru->key);
        }
    }
};`,
            c: `#include <stdlib.h>

struct DNode {
    int key;
    int val;
    struct DNode* prev;
    struct DNode* next;
};

struct DNode* newDNode(int key, int val) {
    struct DNode* n = (struct DNode*)malloc(sizeof(struct DNode));
    n->key = key; n->val = val; n->prev = NULL; n->next = NULL;
    return n;
}

#define TAB 4099

typedef struct {
    int capacity;
    int size;
    struct DNode* head;
    struct DNode* tail;
    struct DNode* map[TAB];
    int mapKeys[TAB];
    int mapUsed[TAB];
} LRUCache;

static int slot(LRUCache* c, int key, int create) {
    unsigned h = (unsigned)key * 2654435761u;
    for (int i = 0; i < TAB; i++) {
        int s = (h + i) % TAB;
        if (!c->mapUsed[s]) {
            if (!create) return -1;
            c->mapUsed[s] = 1;
            c->mapKeys[s] = key;
            return s;
        }
        if (c->mapKeys[s] == key) return s;
    }
    return -1;
}

static void add(LRUCache* c, struct DNode* node) {
    node->next = c->head->next;
    node->prev = c->head;
    c->head->next->prev = node;
    c->head->next = node;
}

static void removeNode(struct DNode* node) {
    node->prev->next = node->next;
    node->next->prev = node->prev;
}

void lruInit(LRUCache* c, int capacity) {
    c->capacity = capacity;
    c->size = 0;
    c->head = newDNode(0, 0);
    c->tail = newDNode(0, 0);
    c->head->next = c->tail;
    c->tail->prev = c->head;
    for (int i = 0; i < TAB; i++) c->mapUsed[i] = 0;
}

int lruGet(LRUCache* c, int key) {
    int s = slot(c, key, 0);
    if (s < 0) return -1;
    struct DNode* node = c->map[s];
    removeNode(node);
    add(c, node);
    return node->val;
}

void lruPut(LRUCache* c, int key, int value) {
    int s = slot(c, key, 0);
    if (s >= 0) {
        removeNode(c->map[s]);
        c->mapUsed[s] = 0;
        c->size--;
    }
    struct DNode* node = newDNode(key, value);
    add(c, node);
    s = slot(c, key, 1);
    c->map[s] = node;
    c->size++;
    if (c->size > c->capacity) {
        struct DNode* lru = c->tail->prev;
        removeNode(lru);
        int t = slot(c, lru->key, 0);
        if (t >= 0) c->mapUsed[t] = 0;
        c->size--;
    }
}`
          }
        }
      ]
    }
  ]
};
