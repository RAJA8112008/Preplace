window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA.cpp = {
  kind: "practice",
  lang: "cpp",
  notes: [
    {
      title: "Scope Resolution Operator (::)",
      body: "What this is\nThe Scope Resolution Operator `::` is used in C++ to specify the exact scope of an identifier (variable, function, class, or enum). It tells the compiler where to look when names collide or belong to a class/namespace.\n\n5 Major Uses of `::`:\n1. Global Scope (`::var`): Access a global variable when a local variable has the identical name.\n2. Class Member Definition (`ClassName::functionName`): Define class methods outside the class body.\n3. Static Members (`ClassName::staticVar` or `ClassName::staticMethod()`): Call class static members without creating an object.\n4. Namespaces (`std::cout`, `namespaceName::member`): Disambiguate identifiers across different library namespaces.\n5. Scoped Enums (`enum class Color { Red, Blue }; Color::Red`): Access strongly typed enum values.\n\nReal-life example\nCalling someone by their full address: \"Room 4\" inside your house is local, while \"Country::State::City::Room4\" specifies the exact worldwide location.\n\nWhat it solves\nPrevents name collisions across large codebases and allows clear separation between class declaration in header files and implementation in `.cpp` files.\n\nWatch out\nUsing `.` or `->` instead of `::` for static methods or namespace members."
    },
    {
      title: "Pointers (*) vs References (&)",
      body: "What this is\n• Pointer (`int* ptr = &x`): A variable that stores the memory address of another variable. Can be re-assigned, can be `nullptr`, supports pointer arithmetic.\n• Reference (`int& ref = x`): An alias (alternative name) for an existing variable. Must be initialized at creation, cannot be re-bound, cannot be null.\n\nKey Differences:\n• Memory: Pointer has its own memory address storing another address; Reference shares the memory location of the original variable.\n• Safety: References are safer and easier to read (no `*` or `->` needed); Pointers are needed for dynamic memory allocation, data structures (linked lists, trees), and optional/nullable values.\n\nReal-life example\n• Pointer: A sticky note with someone's house address written on it. You can erase the address and write a new one, or tear it up (`nullptr`).\n• Reference: A person's nickname (e.g. \"Bob\" for \"Robert\"). It refers directly to the same human.\n\nUses\nPass large objects by `const Type&` to avoid expensive copies without pointer syntax."
    },
    {
      title: "Member Access (. vs -> vs ::)",
      body: "What this is\nC++ provides three distinct operators to access members and methods:\n1. Dot Operator (`.`): Accesses members of a direct object value or reference (`student.getMarks()`).\n2. Arrow Operator (`->`): Accesses members of an object through a pointer (`ptr->getMarks()`). It is shorthand for `(*ptr).getMarks()`.\n3. Scope Resolution (`::`): Accesses class-level static members, types, constants, or namespace members (`Student::schoolName`, `std::vector`).\n\nReal-life example\n• `.` is pressing a button on the TV in your hands.\n• `->` is pointing your remote at a TV across the room.\n• `::` is reading the brand manual for all TVs made by that manufacturer.\n\nWhat it solves\nProvides crystal-clear distinction between stack values, heap pointer dereferencing, and class-level metadata."
    },
    {
      title: "Memory Management (new/delete vs Smart Pointers)",
      body: "What this is\nIn modern C++ (C++11 and later), manual `new` and `delete` are replaced by Smart Pointers which automatically deallocate heap memory when objects go out of scope (RAII principle):\n1. `std::unique_ptr<T>`: Exclusive ownership. Cannot be copied, only moved (`std::move`). Automatically deletes memory when destroyed.\n2. `std::shared_ptr<T>`: Shared ownership with Reference Counting. Memory is deleted when the last `shared_ptr` is destroyed.\n3. `std::weak_ptr<T>`: Non-owning observer of a `shared_ptr` to break circular dependency memory leaks.\n\nReal-life example\n• `unique_ptr`: A physical passport — only one person owns and carries it.\n• `shared_ptr`: A shared Netflix account — stays active as long as at least 1 user is subscribed.\n• `weak_ptr`: A person looking at the Netflix show without keeping the subscription alive.\n\nWhat it solves\nEliminates memory leaks, dangling pointers, and double-free crashes."
    },
    {
      title: "const, constexpr, and const references",
      body: "What this is\n• `const`: Specifies that a variable value cannot be mutated after initialization, or that a member function does not modify any object state (`void display() const`).\n• `constexpr`: Specifies that an expression or function can be evaluated at compile time, enabling extreme runtime performance.\n• `const Type&`: Used in function parameters to pass large objects (like `std::vector` or `std::string`) by reference to avoid copying, while guaranteeing the function won't mutate the data.\n\nReal-life example\n• `const` is a signed contract: cannot be edited.\n• `constexpr` is pre-calculating taxes before opening the store.\n• `const auto&` is letting a customer read a library book without photocopying it and without allowing them to write on pages."
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "What is the scope resolution operator :: in C++ and when is it used?",
      a: "What this is\nThe scope resolution operator `::` in C++ is used to qualify and access identifiers in specific scopes:\n\nMajor Use Cases:\n• 1. Global Scope (`::x`): Access a global variable when a local variable with the same name shadows it.\n• 2. Defining Class Methods Outside Class Body (`ClassName::methodName`).\n• 3. Accessing Static Members (`ClassName::staticVar` or `ClassName::staticMethod()`).\n• 4. Accessing Namespaces (`std::cout`, `std::vector`).\n• 5. Scoped Enums (`enum class Color { Red, Blue }; Color::Red`).\n• 6. Nested Classes (`Outer::Inner`).\n\nReal-life example\nSpecifying country code before a phone number: `+1::5550199` tells the telecom system which country namespace to route the call to.",
      code: `#include <iostream>
using namespace std;

int count = 100; // Global count

class Counter {
public:
    static int instances; // Static member
    void print();         // Method declaration
};

int Counter::instances = 0; // 1. Scope resolution for static definition

void Counter::print() {     // 2. Scope resolution for method definition
    int count = 5;          // Local variable
    cout << "Local count: " << count << endl;     // 5
    cout << "Global count: " << ::count << endl;  // 100 (:: refers to global)
}

int main() {
    Counter::instances++;   // 3. Access static member without object
    Counter c;
    c.print();
    return 0;
}`,
      ask: "Most asked · Google · Microsoft · Amazon · Adobe"
    },
    {
      id: 2,
      level: "beginner",
      q: "Pointer * vs Reference & in C++?",
      a: "What this is\n• Pointer (`int* p = &x`): A variable holding a memory address. Can point to `nullptr`, can be reassigned to different variables, and supports arithmetic (`p++`).\n• Reference (`int& r = x`): An alias (nickname) for an existing variable. Must be initialized upon creation, cannot be rebound to another variable, and cannot be null.\n\nKey Differences:\n• Syntax: Pointer uses `*p` to dereference and `&x` to get address; Reference is used directly as `r`.\n• Reassignment: Pointer can point to `a` today and `b` tomorrow; Reference stays bound to `a` forever.\n• Safety: References are inherently safer because they cannot be null dangling pointers.",
      code: `#include <iostream>
using namespace std;

void swapByPointer(int* a, int* b) {
    int temp = *a; // Dereference pointer
    *a = *b;
    *b = temp;
}

void swapByReference(int& a, int& b) {
    int temp = a;  // Clean syntax, no dereferencing needed
    a = b;
    b = temp;
}

int main() {
    int x = 10, y = 20;
    int* ptr = &x;     // Pointer holds address of x
    int& ref = x;      // Reference is an alias for x

    ref = 15;          // Mutates x to 15
    swapByReference(x, y); // Clean call: swapByReference(x, y)
    cout << "x: " << x << ", y: " << y << endl;
    return 0;
}`,
      ask: "Most asked · Amazon · Microsoft · Qualcomm · Cisco"
    },
    {
      id: 3,
      level: "beginner",
      q: "When do we use . vs -> vs :: in C++?",
      a: "What this is\n• Dot operator (`.`): Used when accessing a member on an actual object instance or reference on the stack (`obj.member`).\n• Arrow operator (`->`): Used when accessing a member through an object pointer (`ptr->member`). Shorthand for `(*ptr).member`.\n• Scope resolution (`::`): Used when accessing class-level static members, typedefs, enums, or namespaces (`Class::member`, `std::sort`).",
      code: `#include <iostream>
using namespace std;

class Player {
public:
    int score = 100;
    static int maxPlayers;
    void show() { cout << "Score: " << score << endl; }
};
int Player::maxPlayers = 4; // :: for static definition

int main() {
    Player p1;             // Stack object
    p1.show();             // . on direct object

    Player* p2 = new Player(); // Pointer to heap object
    p2->show();            // -> on pointer (equivalent to (*p2).show())
    
    cout << Player::maxPlayers << endl; // :: for static member
    delete p2;
    return 0;
}`,
      ask: "Most asked · Microsoft · Amazon · TCS · Infosys"
    },
    {
      id: 4,
      level: "intermediate",
      q: "What is const member function in C++ (void print() const)?",
      a: "What this is\nA `const` member function guarantees that it will not modify any data members of the class instance, nor call any non-const member functions.\n\nWhy it matters:\n• 1. `const` objects can ONLY call `const` member functions.\n• 2. Enables pass-by-const-reference (`const ClassName& obj`), ensuring read-only methods can be invoked safely without compiler errors.\n• 3. If a variable must be mutable even inside a const function, mark it with the `mutable` keyword (e.g. mutex locks or cache hits).",
      code: `#include <iostream>
using namespace std;

class BankAccount {
private:
    double balance;
    mutable int accessCount = 0; // mutable can be modified in const functions

public:
    BankAccount(double b) : balance(b) {}

    // const member function: read-only guarantee
    double getBalance() const {
        accessCount++; // Allowed because mutable
        // balance += 10; // COMPILER ERROR! Cannot modify in const function
        return balance;
    }
};

void display(const BankAccount& acc) {
    cout << "Balance: " << acc.getBalance() << endl; // Works because getBalance is const
}

int main() {
    BankAccount myAcc(5000);
    display(myAcc);
    return 0;
}`,
      ask: "Most asked · Adobe · Google · Amazon · Microsoft"
    },
    {
      id: 5,
      level: "beginner",
      q: "malloc/free vs new/delete in C++?",
      a: "What this is\n• `new` and `delete` are C++ operators that allocate memory AND call constructors/destructors automatically.\n• `malloc()` and `free()` are C library functions that allocate raw memory bytes without initializing objects (no constructors called).\n\nKey Differences:\n• Return type: `new` returns typed pointer (`int*`); `malloc` returns `void*` requiring a cast.\n• Constructors: `new` calls constructor; `malloc` leaves memory uninitialized.\n• Size: `new` calculates size automatically (`new int[10]`); `malloc` requires `sizeof(int) * 10`.\n• Failure: `new` throws `std::bad_alloc` exception; `malloc` returns `NULL`.",
      code: `#include <iostream>
using namespace std;

class Node {
public:
    Node() { cout << "Constructor called!\n"; }
    ~Node() { cout << "Destructor called!\n"; }
};

int main() {
    // C++ way: Calls constructor & destructor
    Node* n1 = new Node();
    delete n1; // Calls destructor and frees heap

    // Array allocation:
    int* arr = new int[5]{1, 2, 3, 4, 5};
    delete[] arr; // Note: delete[] for arrays

    return 0;
}`,
      ask: "Most asked · Amazon · Microsoft · Qualcomm · Intel"
    },
    {
      id: 6,
      level: "intermediate",
      q: "What are Smart Pointers in C++ (unique_ptr, shared_ptr, weak_ptr)?",
      a: "What this is\nSmart pointers manage heap memory automatically following RAII (Resource Acquisition Is Initialization). When the smart pointer goes out of scope, it automatically frees the allocated object.\n\n3 Types of Smart Pointers (C++11 `<memory>`):\n1. `std::unique_ptr<T>`: Sole, exclusive ownership. Cannot be copied, only moved (`std::move`). Zero runtime overhead.\n2. `std::shared_ptr<T>`: Shared ownership with reference count. Automatically deletes memory when reference count drops to 0.\n3. `std::weak_ptr<T>`: Non-owning reference to `shared_ptr`. Used to break circular reference memory leaks.",
      code: `#include <iostream>
#include <memory>
using namespace std;

class Resource {
public:
    Resource() { cout << "Resource acquired\n"; }
    ~Resource() { cout << "Resource destroyed\n"; }
    void work() { cout << "Working...\n"; }
};

int main() {
    // 1. unique_ptr (Exclusive)
    unique_ptr<Resource> u1 = make_unique<Resource>();
    u1->work();
    // unique_ptr<Resource> u2 = u1; // ERROR: Cannot copy unique_ptr
    unique_ptr<Resource> u2 = move(u1); // OK: Ownership transferred to u2

    // 2. shared_ptr (Reference counted)
    shared_ptr<Resource> s1 = make_shared<Resource>();
    {
        shared_ptr<Resource> s2 = s1; // Ref count = 2
        cout << "Shared count: " << s1.use_count() << endl; // 2
    } // s2 destroyed, Ref count = 1
    cout << "Shared count: " << s1.use_count() << endl; // 1

    return 0; // All resources automatically destroyed without leaks!
}`,
      ask: "Most asked · Google · Meta · Microsoft · Amazon · Uber"
    },
    {
      id: 7,
      level: "beginner",
      q: "What is nullptr vs NULL in C++?",
      a: "What this is\n• `NULL` is a preprocessor macro defined as integer `0` (or `(void*)0`). Because it is an integer, function overloading between `int` and pointer types causes ambiguous compiler bugs.\n• `nullptr` (introduced in C++11) is a strongly-typed keyword of type `std::nullptr_t`. It can only be assigned to pointer types, never integers.",
      code: `#include <iostream>
using namespace std;

void func(int x) { cout << "Called func(int): " << x << endl; }
void func(int* ptr) { cout << "Called func(int*)" << endl; }

int main() {
    // func(NULL); // COMPILER ERROR or ambiguous call: 0 matches int!
    func(nullptr); // Perfectly calls func(int*)
    func(0);       // Calls func(int)
    return 0;
}`,
      ask: "Most asked · Microsoft · Adobe · Qualcomm"
    },
    {
      id: 8,
      level: "intermediate",
      q: "What is constexpr vs const in C++?",
      a: "What this is\n• `const`: Specifies that a variable's value cannot change after runtime or compile-time initialization (`const int age = getUserInput();` is valid).\n• `constexpr`: Specifies that the expression or function MUST be evaluated at compile time. It can be used for array bounds, template arguments, and zero-runtime computation.",
      code: `#include <iostream>
using namespace std;

// Evaluated completely at compile time
constexpr int square(int x) {
    return x * x;
}

int main() {
    constexpr int size = square(5); // Computed at compile time: 25
    int arr[size]; // Valid: size is a compile-time constant

    const int runtimeVal = rand(); // const at runtime
    // constexpr int fail = runtimeVal; // ERROR: runtimeVal is not known at compile time
    cout << "Array size: " << size << endl;
    return 0;
}`,
      ask: "Most asked · Google · Nvidia · Bloomberg"
    },
    {
      id: 9,
      level: "advanced",
      q: "What are Move Semantics and std::move in C++?",
      a: "What this is\nMove Semantics (introduced in C++11) avoids deep copying large resources (like heap arrays or strings) by stealing the internal buffer from temporary rvalue objects (`Type&&`).\n\nHow it works:\n• `lvalue`: Named object with persistent memory address (`string s = \"hello\";`).\n• `rvalue`: Temporary unnamed value that is about to be destroyed (`string(\"temp\")` or function return value).\n• `std::move(x)`: Casts an lvalue into an rvalue reference, signaling that `x`'s resources can be safely transferred rather than copied.",
      code: `#include <iostream>
#include <vector>
#include <string>
using namespace std;

int main() {
    vector<string> list;
    string text = "A very long heavy string with lots of data";

    // Copy: Duplicates text memory
    list.push_back(text); 
    cout << "Original text after copy: " << text << endl;

    // Move: Steals internal pointer from text into list (O(1) transfer)
    list.push_back(std::move(text));
    cout << "Original text after move: " << text << " (empty/hollowed)" << endl;

    return 0;
}`,
      ask: "Most asked · Meta · Google · Amazon · Microsoft · Apple"
    },
    {
      id: 10,
      level: "intermediate",
      q: "Why should Base Class destructors always be virtual in C++?",
      a: "What this is\nWhen deleting a derived class object through a pointer to the base class (`Base* ptr = new Derived(); delete ptr;`), if the base class destructor is NOT marked `virtual`, the compiler will ONLY invoke the Base destructor. The Derived destructor will never execute, causing memory leaks for any resources allocated inside Derived.",
      code: `#include <iostream>
using namespace std;

class Base {
public:
    Base() { cout << "Base constructor\n"; }
    // MANDATORY: virtual destructor
    virtual ~Base() { cout << "Base destructor\n"; }
};

class Derived : public Base {
    int* data;
public:
    Derived() { 
        data = new int[100]; 
        cout << "Derived constructor (allocated memory)\n"; 
    }
    ~Derived() override { 
        delete[] data; 
        cout << "Derived destructor (freed memory)\n"; 
    }
};

int main() {
    Base* obj = new Derived();
    delete obj; // Calls ~Derived() first, then ~Base() because of virtual!
    return 0;
}`,
      ask: "Most asked · Amazon · Microsoft · Google · Cisco · Adobe"
    },
    {
      id: 11,
      level: "beginner",
      q: "What is the difference between struct and class in C++?",
      a: "What this is\nIn C++, `struct` and `class` are almost identical with only two default visibility differences:\n1. Default Member Access: Members in a `struct` are `public` by default; members in a `class` are `private` by default.\n2. Default Inheritance Access: Inheritance from a `struct` is `public` by default; inheritance from a `class` is `private` by default.\n\nBest Practice:\nUse `struct` for Plain Old Data (POD) / passive data holders (e.g. `Point { int x, y; }`) and `class` when encapsulating private state and business logic.",
      code: `#include <iostream>
using namespace std;

struct Point {
    int x, y; // public by default
};

class Circle {
    int radius; // private by default
public:
    void setRadius(int r) { radius = r; }
};

int main() {
    Point p;
    p.x = 10; // Allowed: x is public

    Circle c;
    // c.radius = 5; // COMPILER ERROR: radius is private
    c.setRadius(5);
    return 0;
}`,
      ask: "Most asked · TCS · Infosys · Microsoft · Qualcomm"
    },
    {
      id: 12,
      level: "intermediate",
      q: "What is the explicit keyword in C++ constructors?",
      a: "What this is\nIn C++, a constructor with a single argument acts as an implicit conversion operator by default. Marking single-argument constructors with `explicit` prevents the compiler from performing unwanted implicit type conversions.",
      code: `#include <iostream>
using namespace std;

class Complex {
public:
    double real;
    explicit Complex(double r) : real(r) {} // Prevents implicit conversion
};

void printComplex(Complex c) {
    cout << "Real: " << c.real << endl;
}

int main() {
    Complex c1(5.0); // Direct initialization: OK
    printComplex(c1);

    // printComplex(5.0); // COMPILER ERROR without explicit! 5.0 won't accidentally convert
    printComplex(Complex(5.0)); // OK: Explicitly constructed
    return 0;
}`,
      ask: "Most asked · Google · Bloomberg · Adobe"
    },
    {
      id: 13,
      level: "intermediate",
      q: "What is a friend function and friend class in C++?",
      a: "What this is\nA `friend` function or class is granted special access to private and protected members of the class where it is declared. It is NOT a member of the class, but has full access rights.\n\nCommon Uses:\n• Operator overloading (like stream insertion `operator<<` for printing objects).\n• Tightly coupled classes (like a `LinkedList` and `NodeIterator`).",
      code: `#include <iostream>
using namespace std;

class Account {
private:
    double secretBalance = 10000;

    // Friend function declaration
    friend void taxAuditor(const Account& acc);
    friend ostream& operator<<(ostream& os, const Account& acc);
};

void taxAuditor(const Account& acc) {
    // Can access private secretBalance directly
    cout << "Auditing balance: " << acc.secretBalance << endl;
}

ostream& operator<<(ostream& os, const Account& acc) {
    os << "Account[Balance=$" << acc.secretBalance << "]";
    return os;
}

int main() {
    Account a;
    taxAuditor(a);
    cout << a << endl; // Overloaded << operator
    return 0;
}`,
      ask: "Most asked · Amazon · Microsoft · Oracle"
    },
    {
      id: 14,
      level: "intermediate",
      q: "How does std::vector manage dynamic capacity vs size in C++?",
      a: "What this is\n`std::vector` is a dynamic array stored on contiguous heap memory:\n• `size()`: Number of actual elements currently stored.\n• `capacity()`: Total memory allocated before reallocation is needed.\n\nGrowth Mechanism:\nWhen `size == capacity` and a new element is pushed, vector allocates a new memory block (typically 1.5x or 2x previous capacity), moves existing elements, and deallocates the old memory block. This guarantees amortized O(1) insertion time.",
      code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v;
    cout << "Initial size: " << v.size() << ", capacity: " << v.capacity() << endl;

    for (int i = 1; i <= 5; i++) {
        v.push_back(i);
        cout << "Pushed " << i << " -> size: " << v.size() << ", capacity: " << v.capacity() << endl;
    }

    // Optimization: reserve memory upfront to prevent reallocations
    vector<int> optimized;
    optimized.reserve(100); // Allocates capacity 100 with size 0
    return 0;
}`,
      ask: "Most asked · Amazon · Microsoft · Google · Uber"
    },
    {
      id: 15,
      level: "intermediate",
      q: "std::map (Red-Black Tree) vs std::unordered_map (Hash Table)?",
      a: "What this is\n• `std::map`: Self-balancing Red-Black Binary Search Tree. Elements are sorted by key. Lookup, insertion, and deletion are guaranteed O(log N).\n• `std::unordered_map`: Hash Table. Elements are stored in buckets via hashing (unordered). Average lookup is O(1); worst-case O(N) during hash collisions.\n\nWhen to pick which:\n• Pick `std::map` when elements must be sorted or range queries (`lower_bound`, `upper_bound`) are needed.\n• Pick `std::unordered_map` for fast key-value lookups (Two Sum, Frequency count).",
      code: `#include <iostream>
#include <map>
#include <unordered_map>
using namespace std;

int main() {
    // 1. std::map: Always sorted by key
    map<string, int> treeMap;
    treeMap["banana"] = 3;
    treeMap["apple"] = 5;
    treeMap["cherry"] = 2;

    cout << "--- std::map (Sorted) ---\n";
    for (const auto& [fruit, count] : treeMap) {
        cout << fruit << ": " << count << endl; // apple, banana, cherry
    }

    // 2. std::unordered_map: O(1) average lookup
    unordered_map<string, int> hashMap;
    hashMap["id_101"] = 99;
    cout << "Hash lookup: " << hashMap["id_101"] << endl;

    return 0;
}`,
      ask: "Most asked · Amazon · Microsoft · Google · Meta · Adobe"
    },
    {
      id: 16,
      level: "advanced",
      q: "What is Iterator Invalidation in C++ STL?",
      a: "What this is\nIterator invalidation occurs when a modifying container operation (such as `push_back`, `erase`, `insert`, or `rehash`) invalidates existing pointers or iterators pointing into that container. Using an invalidated iterator leads to undefined behavior or segmentation faults.\n\nCommon Causes:\n• `std::vector::push_back()` triggering memory reallocation (invalidates all iterators).\n• Erasing an element while iterating in a loop without re-assigning the iterator to the return value of `erase()`.",
      code: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 4, 5, 6};

    // Correct way to erase while iterating:
    for (auto it = v.begin(); it != v.end(); /* no it++ here */) {
        if (*it % 2 == 0) {
            it = v.erase(it); // erase returns the iterator to the next valid element
        } else {
            ++it;
        }
    }

    for (int n : v) cout << n << " "; // 1 3 5
    cout << endl;
    return 0;
}`,
      ask: "Most asked · Google · Bloomberg · Microsoft"
    },
    {
      id: 17,
      level: "intermediate",
      q: "What are Function Templates and Class Templates in C++?",
      a: "What this is\nTemplates allow writing generic functions and classes that work with any data type without code duplication. The compiler generates concrete type instances at compile time (Template Specialization).\n\nSyntax:\n`template <typename T>` or `template <class T>`.",
      code: `#include <iostream>
using namespace std;

// Function Template
template <typename T>
T getMaximum(T a, T b) {
    return (a > b) ? a : b;
}

// Class Template
template <typename T>
class Pair {
public:
    T first, second;
    Pair(T a, T b) : first(a), second(b) {}
    void print() { cout << "[" << first << ", " << second << "]\n"; }
};

int main() {
    cout << getMaximum<int>(10, 20) << endl;       // 20
    cout << getMaximum<double>(3.14, 2.71) << endl; // 3.14

    Pair<string> stringPair("Hello", "World");
    stringPair.print();
    return 0;
}`,
      ask: "Most asked · Microsoft · Adobe · Qualcomm"
    },
    {
      id: 18,
      level: "advanced",
      q: "What is the Diamond Problem in Multiple Inheritance and virtual inheritance?",
      a: "What this is\nThe Diamond Problem occurs when class `D` inherits from both `B` and `C`, and both `B` and `C` inherit from the same base class `A`. Without virtual inheritance, `D` receives TWO separate copies of `A`'s member variables, causing compiler ambiguity and memory waste.\n\nSolution:\nUse `virtual public A` in `B` and `C`. This guarantees only ONE shared instance of `A` exists in `D`.",
      code: `#include <iostream>
using namespace std;

class Animal {
public:
    int age = 5;
};

// virtual inheritance prevents duplicate Animal instances
class Mammal : virtual public Animal {};
class WingedAnimal : virtual public Animal {};

class Bat : public Mammal, public WingedAnimal {};

int main() {
    Bat b;
    cout << "Bat age: " << b.age << endl; // No ambiguity: only 1 shared Animal instance!
    return 0;
}`,
      ask: "Most asked · Amazon · Microsoft · Cisco · Qualcomm"
    },
    {
      id: 19,
      level: "intermediate",
      q: "What is RAII (Resource Acquisition Is Initialization) in C++?",
      a: "What this is\nRAII is a core C++ design pattern where resource management (memory, file handles, mutex locks, network sockets) is tied directly to object lifetime:\n1. Acquire the resource inside the constructor.\n2. Release the resource inside the destructor.\n\nSince C++ automatically calls destructors when local stack objects go out of scope (even during exceptions), RAII guarantees zero resource leaks.",
      code: `#include <iostream>
#include <fstream>
#include <mutex>
using namespace std;

mutex mtx;

void safePrint(int id) {
    // std::lock_guard is an RAII wrapper around mutex
    lock_guard<mutex> lock(mtx); // Locks mutex in constructor
    cout << "Thread " << id << " executing safely\n";
} // lock_guard destructor automatically unlocks mutex when leaving scope

int main() {
    safePrint(1);
    safePrint(2);
    return 0;
}`,
      ask: "Most asked · Google · Meta · Microsoft · Amazon"
    },
    {
      id: 20,
      level: "intermediate",
      q: "What is Operator Overloading and how to overload operator<< in C++?",
      a: "What this is\nOperator overloading lets user-defined classes define custom behaviors for standard C++ operators (`+`, `-`, `==`, `[]`, `<<`, `>>`).\n\nOverloading `operator<<` for output streams:\nMust be defined as a non-member friend function taking `std::ostream&` and `const ClassName&`.",
      code: `#include <iostream>
using namespace std;

class Complex {
public:
    double r, i;
    Complex(double r = 0, double i = 0) : r(r), i(i) {}

    // Overloading + operator
    Complex operator+(const Complex& other) const {
        return Complex(r + other.r, i + other.i);
    }

    // Overloading << stream insertion operator
    friend ostream& operator<<(ostream& os, const Complex& c) {
        os << c.r << " + " << c.i << "i";
        return os;
    }
};

int main() {
    Complex c1(3, 4), c2(1, 2);
    Complex c3 = c1 + c2; // Uses overloaded +
    cout << "c3 = " << c3 << endl; // Uses overloaded <<
    return 0;
}`,
      ask: "Most asked · Microsoft · Adobe · TCS"
    },
    {
      id: 21,
      level: "intermediate",
      q: "What are Lambda Functions and Capture Lists in C++?",
      a: "What this is\nA Lambda function is an inline anonymous function introduced in C++11. Syntax:\n`[capture_clause](parameters) -> return_type { body }`\n\nCapture Clauses:\n• `[]`: Empty — captures nothing from outer scope.\n• `[=]`: Captures all outer variables by value (read-only copy).\n• `[&]`: Captures all outer variables by reference.\n• `[x, &y]`: Captures `x` by value, `y` by reference.",
      code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> nums = {5, 2, 8, 1, 9};

    // Lambda with custom descending sort
    sort(nums.begin(), nums.end(), [](int a, int b) {
        return a > b;
    });

    int threshold = 3;
    // Lambda capturing threshold by value
    int count = count_if(nums.begin(), nums.end(), [threshold](int n) {
        return n > threshold;
    });

    cout << "Elements > " << threshold << ": " << count << endl;
    return 0;
}`,
      ask: "Most asked · Google · Amazon · Meta · Microsoft"
    }
  ]
};
