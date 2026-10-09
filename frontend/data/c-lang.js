window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["c-lang"] = {
  kind: "practice",
  lang: "c",
  notes: [
    {
      title: "Pointers (*) & Address-of (&) in C",
      body: "What this is\nIn C, memory is addressed as an array of bytes. Pointers are variables that store the numeric memory address of another variable:\n• `&x` (Address-of Operator): Extracts the physical RAM address of variable `x`.\n• `*ptr` (Dereference Operator): Reads or writes the value located at the address stored in `ptr`.\n• Pointer Arithmetic: Adding `1` to `ptr` increments the address by `sizeof(type)` bytes, not 1 byte.\n\nReal-life example\nA GPS coordinate: `&home` is the coordinate string; `*gps` is walking into the actual house.\n\nWhat it solves\nEnables pass-by-reference in functions (mutating caller variables), dynamic heap allocation, and efficient array/string traversals."
    },
    {
      title: "Dynamic Memory (malloc, calloc, realloc, free)",
      body: "What this is\nC does not have garbage collection. Memory on the heap must be manually requested from the OS and returned:\n1. `malloc(size)`: Allocates `size` uninitialized bytes (contains random garbage data).\n2. `calloc(num, size)`: Allocates and clears memory to zero.\n3. `realloc(ptr, new_size)`: Resizes existing allocated memory block while preserving data.\n4. `free(ptr)`: Releases heap memory back to the OS. (Always set `ptr = NULL;` afterwards to prevent dangling pointers).\n\nReal-life example\nChecking into a hotel room: `malloc` gives you a room; `free` checks you out. If you keep the key and walk back in after checkout, that is undefined behavior."
    },
    {
      title: "struct vs union in C",
      body: "What this is\n• `struct`: Every member has its own separate memory offset. The total size is at least the sum of all members (plus padding for alignment).\n• `union`: All members share the EXACT same memory location. The total size equals the size of its largest member. Only one member can be stored at a time.\n\nReal-life example\n• `struct`: A toolbox containing a hammer, screwdriver, and wrench together.\n• `union`: A multipurpose handle that can hold either a hammer head OR a screwdriver bit one at a time."
    },
    {
      title: "Storage Classes (auto, static, extern, register, volatile)",
      body: "What this is\nStorage classes determine the scope, lifetime, and storage location of variables:\n• `auto`: Default for local variables (allocated on stack, destroyed on function exit).\n• `static`: Persists value across multiple function calls; scoped to the file or function.\n• `extern`: Declares a global variable defined in another source file.\n• `register`: Hints compiler to store variable in CPU register for high-speed access.\n• `volatile`: Tells compiler that value may change asynchronously (hardware registers/interrupts), preventing compiler optimizations."
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "What is the difference between * and & operators in C?",
      a: "What this is\n• `&` (Address-of operator): Returns the memory address of a variable in RAM.\n• `*` (Dereference operator): When used in declaration (`int* p`), it defines a pointer; when used in expressions (`*p`), it accesses the value stored at that address.\n\nReal-life example\n`&house` gives the postal address; `*address` lets you enter the house and read or change the furniture inside.",
      code: `#include <stdio.h>

void swap(int* a, int* b) {
    int temp = *a; // Dereference to get value
    *a = *b;       // Change value at address a
    *b = temp;     // Change value at address b
}

int main() {
    int x = 10, y = 20;
    int* ptr = &x; // ptr holds address of x

    printf("Value of x: %d\\n", *ptr);  // 10
    printf("Address of x: %p\\n", ptr); // Hex address

    swap(&x, &y);  // Pass addresses
    printf("After swap: x = %d, y = %d\\n", x, y); // x=20, y=10
    return 0;
}`,
      ask: "Most asked · TCS · Wipro · Infosys · Qualcomm · Cisco"
    },
    {
      id: 2,
      level: "beginner",
      q: "malloc() vs calloc() vs realloc() vs free() in C?",
      a: "What this is\n• `malloc(bytes)`: Allocates raw uninitialized memory block. Returns `void*` or `NULL` if out of memory.\n• `calloc(count, size)`: Allocates memory and initializes every byte to `0`.\n• `realloc(ptr, new_bytes)`: Expands or contracts existing memory block.\n• `free(ptr)`: Returns allocated memory to OS to avoid memory leaks.",
      code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    // 1. malloc: uninitialized memory
    int* arr1 = (int*)malloc(5 * sizeof(int));

    // 2. calloc: zero-initialized memory
    int* arr2 = (int*)calloc(5, sizeof(int));

    // 3. realloc: expand size to 10
    arr1 = (int*)realloc(arr1, 10 * sizeof(int));

    // 4. free: release memory
    free(arr1);
    free(arr2);
    arr1 = NULL; // Avoid dangling pointer
    arr2 = NULL;

    return 0;
}`,
      ask: "Most asked · Amazon · Qualcomm · Intel · Microsoft"
    },
    {
      id: 3,
      level: "beginner",
      q: "What is a Dangling Pointer, Memory Leak, and Wild Pointer in C?",
      a: "What this is\n• Dangling Pointer: A pointer pointing to memory that has already been `free()`d or gone out of stack scope.\n• Memory Leak: Allocated heap memory that is never `free()`d and has no remaining pointers referencing it.\n• Wild Pointer: An uninitialized pointer pointing to an arbitrary/random memory location.",
      code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int* wild; // Wild pointer: uninitialized!

    int* ptr = (int*)malloc(sizeof(int));
    *ptr = 100;
    free(ptr); // Memory freed

    // ptr is now a DANGLING pointer!
    // printf("%d", *ptr); // UNDEFINED BEHAVIOR

    ptr = NULL; // FIX: Nullify pointer after free
    return 0;
}`,
      ask: "Most asked · Qualcomm · Cisco · Microsoft · TCS"
    },
    {
      id: 4,
      level: "beginner",
      q: "What is the difference between struct and union in C?",
      a: "What this is\n• `struct`: Allocates distinct memory for each member. Total size is >= sum of all member sizes (subject to memory alignment padding).\n• `union`: All members share the same starting memory address. Total size equals the size of the largest member. Changing one member overwrites the others.",
      code: `#include <stdio.h>

struct SData {
    int id;       // 4 bytes
    double score; // 8 bytes
}; // Size: ~16 bytes (with padding)

union UData {
    int id;       // 4 bytes
    double score; // 8 bytes
}; // Size: exactly 8 bytes (shares memory)

int main() {
    printf("Struct size: %zu bytes\\n", sizeof(struct SData));
    printf("Union size: %zu bytes\\n", sizeof(union UData));

    union UData u;
    u.id = 42;
    printf("u.id = %d\\n", u.id);
    u.score = 99.5; // Overwrites u.id in memory!
    printf("u.score = %.1f\\n", u.score);
    return 0;
}`,
      ask: "Most asked · TCS · Infosys · Qualcomm · Intel"
    },
    {
      id: 5,
      level: "intermediate",
      q: "What is a Function Pointer in C and where is it used?",
      a: "What this is\nA function pointer stores the memory address of executable function code. It allows passing functions as callback arguments to other functions (e.g. `qsort`).\n\nSyntax:\n`return_type (*pointer_name)(param_types);`",
      code: `#include <stdio.h>

int add(int a, int b) { return a + b; }
int multiply(int a, int b) { return a * b; }

// Function accepting function pointer callback
void compute(int x, int y, int (*operation)(int, int)) {
    printf("Result: %d\\n", operation(x, y));
}

int main() {
    compute(5, 3, add);      // Result: 8
    compute(5, 3, multiply); // Result: 15
    return 0;
}`,
      ask: "Most asked · Qualcomm · Google · Microsoft · Adobe"
    },
    {
      id: 6,
      level: "beginner",
      q: "What is the difference between static global and static local variables in C?",
      a: "What this is\n• `static local variable`: Defined inside a function. Retains its value across multiple function invocations throughout program execution (allocated in Data segment, not stack).\n• `static global variable`: Defined outside functions. Restricts variable scope (Internal Linkage) strictly to the current `.c` file, preventing name clashes across multiple files.",
      code: `#include <stdio.h>

void counter() {
    static int count = 0; // Initialized once, persists between calls
    count++;
    printf("Count: %d\\n", count);
}

int main() {
    counter(); // Count: 1
    counter(); // Count: 2
    counter(); // Count: 3
    return 0;
}`,
      ask: "Most asked · TCS · Qualcomm · Cisco · Microsoft"
    },
    {
      id: 7,
      level: "intermediate",
      q: "What is the volatile keyword in C?",
      a: "What this is\nThe `volatile` keyword instructs the compiler that a variable's value can change unexpectedly at any moment (e.g., via hardware registers, Memory-Mapped I/O, or an Interrupt Service Routine ISR).\n\nIt prevents the compiler from optimizing out repeated reads from the variable.",
      code: `#include <stdio.h>

// Hardware register address in embedded systems
volatile int* statusRegister = (int*)0x40001000;

void waitForHardware() {
    // Compiler will NOT optimize this loop away into a cached register read
    while (*statusRegister == 0) {
        // wait for hardware interrupt to set statusRegister
    }
}

int main() {
    printf("Volatile prevents compiler caching!\\n");
    return 0;
}`,
      ask: "Most asked · Qualcomm · Intel · Texas Instruments · ARM"
    },
    {
      id: 8,
      level: "beginner",
      q: "sizeof vs strlen in C?",
      a: "What this is\n• `sizeof`: Compile-time operator. Returns the total allocated memory in bytes for a type or array, including null terminator `\\0`.\n• `strlen()`: Runtime library function (`<string.h>`). Iterates until finding null terminator `\\0` and returns character count (excluding `\\0`).",
      code: `#include <stdio.h>
#include <string.h>

int main() {
    char str[20] = "Hello";

    printf("sizeof(str) = %zu bytes\\n", sizeof(str)); // 20 (array capacity)
    printf("strlen(str) = %zu chars\\n", strlen(str)); // 5 (characters before '\\0')
    return 0;
}`,
      ask: "Most asked · TCS · Wipro · Infosys"
    },
    {
      id: 9,
      level: "intermediate",
      q: "What is a memory segmentation fault (segfault) in C?",
      a: "What this is\nA Segmentation Fault (`SIGSEGV`) occurs when a program attempts to access a memory location it is not allowed to read or write by the Operating System / MMU.\n\nCommon Causes:\n1. Dereferencing `NULL` or uninitialized pointer (`*ptr`).\n2. Writing to read-only memory (e.g., modifying a string literal `char* s = \"test\"; s[0] = 'a';`).\n3. Buffer overflow past array boundaries.\n4. Stack overflow due to infinite recursion.",
      code: `#include <stdio.h>

int main() {
    // 1. String literal in read-only code segment
    char* str = "Read Only String";
    // str[0] = 'X'; // SEGMENTATION FAULT!

    // 2. Correct writable character array:
    char writable[] = "Writable String";
    writable[0] = 'W'; // OK: on stack
    printf("%s\\n", writable);
    return 0;
}`,
      ask: "Most asked · Qualcomm · Cisco · Microsoft · Google"
    },
    {
      id: 10,
      level: "intermediate",
      q: "What is pointer arithmetic in C?",
      a: "What this is\nWhen you add or subtract an integer `n` to a pointer `ptr`, C advances the address by `n * sizeof(*ptr)` bytes, rather than `n` raw bytes. This enables intuitive array index stepping.",
      code: `#include <stdio.h>

int main() {
    int arr[] = {10, 20, 30, 40, 50};
    int* ptr = arr; // points to arr[0]

    printf("arr[0] = %d\\n", *ptr);       // 10
    printf("arr[1] = %d\\n", *(ptr + 1)); // 20 (advances sizeof(int) bytes)
    printf("arr[2] = %d\\n", *(ptr + 2)); // 30
    return 0;
}`,
      ask: "Most asked · Qualcomm · TCS · Cisco"
    },
    {
      id: 11,
      level: "beginner",
      q: "What is typedef in C and why is it used?",
      a: "What this is\nThe `typedef` keyword creates an alias (new name) for an existing data type, making struct definitions, function pointers, and complex types concise and readable.",
      code: `#include <stdio.h>

typedef struct {
    int x;
    int y;
} Point; // 'Point' is now a valid type name without writing 'struct Point'

typedef unsigned long long uint64;

int main() {
    Point p = {10, 20};
    uint64 bigNum = 18446744073709551615ULL;
    printf("Point: (%d, %d)\\n", p.x, p.y);
    return 0;
}`,
      ask: "Most asked · TCS · Infosys · Wipro"
    },
    {
      id: 12,
      level: "intermediate",
      q: "What is #define macro vs const in C?",
      a: "What this is\n• `#define`: Preprocessor text substitution before compilation. Has no type checking, no scope boundaries, and can cause tricky side-effects with expressions.\n• `const`: True typed variable checked by the compiler. Obeys scope rules.",
      code: `#include <stdio.h>

#define SQUARE(x) (x * x)
#define SAFE_SQUARE(x) ((x) * (x))

int main() {
    // SQUARE(2 + 3) expands to 2 + 3 * 2 + 3 = 11 (BUG!)
    printf("Buggy: %d\\n", SQUARE(2 + 3)); 

    // SAFE_SQUARE(2 + 3) expands to ((2 + 3) * (2 + 3)) = 25 (CORRECT)
    printf("Safe: %d\\n", SAFE_SQUARE(2 + 3));
    return 0;
}`,
      ask: "Most asked · Qualcomm · Cisco · Microsoft"
    },
    {
      id: 13,
      level: "intermediate",
      q: "What are header guards (#ifndef, #define, #endif) in C?",
      a: "What this is\nHeader guards prevent multiple inclusions of the same header file in a compilation unit, avoiding duplicate type definitions and compilation errors.",
      code: `// myheader.h
#ifndef MY_HEADER_H
#define MY_HEADER_H

typedef struct {
    int id;
} Entity;

#endif // MY_HEADER_H`,
      ask: "Most asked · Qualcomm · Cisco · Intel"
    },
    {
      id: 14,
      level: "intermediate",
      q: "What is Memory Alignment and Structure Padding in C?",
      a: "What this is\nCPUs read memory in word chunks (4 or 8 bytes) for maximum performance. To ensure members start at addresses that are multiples of their size, the compiler inserts unused padding bytes between struct members.",
      code: `#include <stdio.h>

struct Unoptimized {
    char a;   // 1 byte
    // 3 bytes padding inserted here!
    int b;    // 4 bytes
    char c;   // 1 byte
    // 3 bytes padding inserted at end!
}; // Total: 12 bytes

struct Optimized {
    int b;    // 4 bytes
    char a;   // 1 byte
    char c;   // 1 byte
    // 2 bytes padding
}; // Total: 8 bytes

int main() {
    printf("Unoptimized size: %zu bytes\\n", sizeof(struct Unoptimized)); // 12
    printf("Optimized size: %zu bytes\\n", sizeof(struct Optimized));     // 8
    return 0;
}`,
      ask: "Most asked · Qualcomm · Intel · Google · Apple"
    },
    {
      id: 15,
      level: "intermediate",
      q: "What is the extern keyword in C?",
      a: "What this is\nThe `extern` keyword declares a variable or function that is defined in another translation unit (source file). It establishes External Linkage.",
      code: `// file1.c
int globalCounter = 100; // Definition

// file2.c
#include <stdio.h>
extern int globalCounter; // Declaration: defined elsewhere

int main() {
    printf("Counter from file1: %d\\n", globalCounter);
    return 0;
}`,
      ask: "Most asked · Qualcomm · Cisco · TCS"
    },
    {
      id: 16,
      level: "intermediate",
      q: "What are Bitfields in C?",
      a: "What this is\nBitfields allow packing multiple integer members into a specified number of bits within a `struct`, minimizing memory footprint in embedded firmware and network packet headers.",
      code: `#include <stdio.h>

struct PacketFlags {
    unsigned int isAck : 1; // Exactly 1 bit (0 or 1)
    unsigned int isSyn : 1; // 1 bit
    unsigned int isFin : 1; // 1 bit
    unsigned int type  : 4; // 4 bits (0 to 15)
};

int main() {
    struct PacketFlags p = {1, 0, 1, 7};
    printf("Size of packed flags: %zu bytes\\n", sizeof(p)); // 4 bytes instead of 16
    return 0;
}`,
      ask: "Most asked · Qualcomm · Cisco · Intel"
    },
    {
      id: 17,
      level: "intermediate",
      q: "What is a void pointer (void*) in C?",
      a: "What this is\nA `void*` is a generic pointer that can point to any data type without a specific type tag. It cannot be directly dereferenced without casting to a concrete type (`(int*)ptr`).",
      code: `#include <stdio.h>

void printValue(void* ptr, char type) {
    if (type == 'i') printf("Integer: %d\\n", *(int*)ptr);
    else if (type == 'f') printf("Float: %.2f\\n", *(float*)ptr);
}

int main() {
    int a = 42;
    float b = 3.14f;
    printValue(&a, 'i');
    printValue(&b, 'f');
    return 0;
}`,
      ask: "Most asked · Qualcomm · Microsoft · Amazon"
    },
    {
      id: 18,
      level: "intermediate",
      q: "What is Little Endian vs Big Endian in C?",
      a: "What this is\n• Little Endian (x86, ARM): The least significant byte (LSB) is stored at the lowest memory address.\n• Big Endian (Network order): The most significant byte (MSB) is stored at the lowest memory address.",
      code: `#include <stdio.h>

int main() {
    unsigned int x = 0x12345678;
    char* c = (char*)&x;

    if (*c == 0x78) {
        printf("System is Little Endian\\n");
    } else {
        printf("System is Big Endian\\n");
    }
    return 0;
}`,
      ask: "Most asked · Qualcomm · Cisco · Apple · ARM"
    },
    {
      id: 19,
      level: "intermediate",
      q: "How to implement generic swap in C using void pointers?",
      a: "What this is\nUsing `void*` and byte-by-byte memory copying (`memcpy` or a byte buffer), we can write a single swap function that swaps any data type regardless of size.",
      code: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void genericSwap(void* a, void* b, size_t size) {
    void* temp = malloc(size);
    memcpy(temp, a, size);
    memcpy(a, b, size);
    memcpy(b, temp, size);
    free(temp);
}

int main() {
    double x = 3.14, y = 2.71;
    genericSwap(&x, &y, sizeof(double));
    printf("Swapped: x = %.2f, y = %.2f\\n", x, y);
    return 0;
}`,
      ask: "Most asked · Google · Microsoft · Amazon"
    },
    {
      id: 20,
      level: "intermediate",
      q: "What is the const keyword positioning in C pointers?",
      a: "What this is\nRead pointer declarations from right to left:\n• `const int* p`: Pointer to constant int (Value cannot change; pointer can move).\n• `int* const p`: Constant pointer to int (Pointer cannot move; value can change).\n• `const int* const p`: Constant pointer to constant int (Neither can change).",
      code: `#include <stdio.h>

int main() {
    int a = 10, b = 20;

    const int* p1 = &a; // Pointer to const
    // *p1 = 15; // ERROR!
    p1 = &b;     // OK: pointer can move

    int* const p2 = &a; // Const pointer
    *p2 = 15;    // OK: value can change
    // p2 = &b;  // ERROR!
    return 0;
}`,
      ask: "Most asked · Qualcomm · Microsoft · TCS"
    },
    {
      id: 21,
      level: "beginner",
      q: "What is the return value of printf() and scanf() in C?",
      a: "What this is\n• `printf()`: Returns the total count of characters successfully printed to stdout (or a negative value on error).\n• `scanf()`: Returns the count of input items successfully matched and assigned (or `EOF` on end-of-file).",
      code: `#include <stdio.h>

int main() {
    int printed = printf("Hello World\\n");
    printf("Characters printed: %d\\n", printed); // 12 (including '\\n')

    int x;
    printf("Enter a number: ");
    // scanf returns 1 if integer successfully read
    if (scanf("%d", &x) == 1) {
        printf("Valid input: %d\\n", x);
    }
    return 0;
}`,
      ask: "Most asked · TCS · Wipro · Infosys"
    },
    {
      id: 22,
      level: "intermediate",
      q: "inline functions vs #define macros in C and C++?",
      a: "What this is\n• `inline` function: A real function where the compiler replaces the function call with the actual function body code at the call site to eliminate function call overhead (stack frame creation). It performs full type checking, argument evaluation once, and respects scope.\n• `#define` macro: Pure text replacement by the preprocessor before compilation. No type checking, no scope, and arguments can be evaluated multiple times causing severe side-effects (`#define SQ(x) ((x)*(x))` with `SQ(i++)`).",
      code: `#include <stdio.h>

#define MACRO_SQUARE(x) ((x) * (x))

static inline int inlineSquare(int x) {
    return x * x; // Evaluates x exactly once, fully type-safe
}

int main() {
    int a = 3;
    // Bug with macro: (a++) * (a++) -> increments 'a' TWICE!
    printf("Macro result: %d, a: %d\\n", MACRO_SQUARE(a++), a);

    int b = 3;
    // Safe with inline: b is incremented once when passed to function
    printf("Inline result: %d, b: %d\\n", inlineSquare(b++), b);
    return 0;
}`,
      ask: "Most asked · Qualcomm · Intel · Microsoft · Cisco · Apple"
    },
    {
      id: 23,
      level: "intermediate",
      q: "What are the Stringizing (#) and Token-Pasting (##) operators in C macros?",
      a: "What this is\n• Stringizing Operator (`#`): Converts a macro parameter into a string constant enclosed in quotes (`#x` -> `\"x\"`).\n• Token-Pasting / Concatenation Operator (`##`): Merges two tokens into a single identifier at preprocess time (`a ## b` -> `ab`).",
      code: `#include <stdio.h>

// 1. Stringizing operator #: converts token to string
#define PRINT_VAR(var) printf(#var " = %d\\n", var)

// 2. Token-pasting operator ##: concatenates tokens into identifier
#define MAKE_VAR_NAME(prefix, num) prefix##num

int main() {
    int score = 95;
    PRINT_VAR(score); // Expands to: printf("score" " = %d\n", score);

    int MAKE_VAR_NAME(player, 1) = 500; // Expands to: int player1 = 500;
    printf("Player 1 score: %d\\n", player1);
    return 0;
}`,
      ask: "Most asked · Qualcomm · Intel · Texas Instruments · ARM"
    },
    {
      id: 24,
      level: "intermediate",
      q: "Why are multi-statement macros written inside do { ... } while(0)?",
      a: "What this is\nWhen a macro contains multiple statements, wrapping them inside `do { ... } while(0)` forces the macro to behave as a single compound statement that syntactically requires a terminating semicolon `;`.\n\nWithout `do-while(0)`, using the macro inside an `if-else` without curly braces causes compiler syntax errors (dangling `else`) or executes only the first statement conditionally.",
      code: `#include <stdio.h>

// SAFE multi-line macro pattern:
#define SAFE_PRINT_TWO(a, b) do { \\
    printf("First: %d\\n", a);   \\
    printf("Second: %d\\n", b);  \\
} while(0)

int main() {
    int condition = 1;

    // Works cleanly inside if-else blocks!
    if (condition)
        SAFE_PRINT_TWO(10, 20); // The semicolon here is syntactically valid
    else
        printf("Condition was false\\n");

    return 0;
}`,
      ask: "Most asked · Qualcomm · Cisco · Linux Kernel · Google"
    },
    {
      id: 25,
      level: "intermediate",
      q: "#pragma once vs traditional #ifndef Header Guards?",
      a: "What this is\n• `#pragma once`: A non-standard but universally supported compiler directive that ensures the file is included only once per compilation unit. Shorter, less error-prone, and faster compile times.\n• `#ifndef HEADER_H ... #endif`: The standard C/C++ preprocessor mechanism. Portable across all compilers, but requires defining a unique macro name per file.",
      code: `// Modern approach (Supported by GCC, Clang, MSVC):
#pragma once

// Traditional standard approach:
#ifndef MY_UTILITY_H
#define MY_UTILITY_H

void helperFunction(void);

#endif // MY_UTILITY_H`,
      ask: "Most asked · Microsoft · Adobe · Qualcomm"
    }
  ]
};
