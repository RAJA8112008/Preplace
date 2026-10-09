window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["os"] = {
  "kind": "topic",
  "notes": [
    {
      "title": "Operating System Core & Dual Mode",
      "flow": [
        "User App",
        "System Call (Trap)",
        "Kernel Mode (Ring 0)",
        "Hardware Access",
        "Return to User Mode"
      ],
      "body": "The problem before\nIn early computers without an OS, every program had direct access to hardware. If a program wrote to the wrong memory address or got stuck in an infinite loop, the entire machine froze. No two programs could run at once without crashing into each other.\n\nWhat this is\nAn Operating System (OS) is a resource manager and an interface between user applications and the physical hardware. It operates in two main modes: User Mode (restricted privileges) and Kernel Mode / Supervisor Mode (Ring 0, full hardware access). Switching between them happens via System Calls (software interrupts / traps).\n\nWhat it solves\nMemory protection, process isolation, CPU scheduling, and hardware abstraction. If user code crashes, the OS cleans it up without bringing down the machine.\n\nReal-life example\nA government office. Citizens (User Mode) cannot walk directly into the treasury vault (Hardware). They must submit an official application at the counter window (System Call), which authorized officers (Kernel Mode) execute safely.\n\nUses\nLinux, Windows, macOS, Android, iOS. Every server, container, and mobile phone relies on these core abstractions.\n\nWatch out\nSystem calls are expensive because they require a context switch from user space to kernel space, saving registers and flushing CPU caches."
    },
    {
      "title": "Processes vs Threads & Memory Layout",
      "flow": [
        "Stack (Local variables, function frames - grows DOWN)",
        "↓ Free Memory Area ↑",
        "Heap (Dynamic memory malloc/new - grows UP)",
        "BSS & Data (Global & static variables)",
        "Text / Code (Compiled machine instructions)"
      ],
      "body": "The problem before\nIf a program only had a single execution stream, doing a long network fetch or disk read blocked the entire UI. But spawning full separate processes for every task used too much memory and made data sharing very slow.\n\nWhat this is\nA Process is a program in execution with its own independent memory space (Text, Data, Heap, Stack, PCB). A Thread is a lightweight unit of execution within a process. All threads of a process share the same Code, Data, Heap, and open file descriptors, but each thread has its own Program Counter, Registers, and Stack.\n\nWhat it solves\nConcurrency with low memory footprint and fast context switching. Web servers can serve thousands of concurrent requests without duplicating gigabytes of heap memory.\n\nReal-life example\nA Process is a complete restaurant kitchen. Threads are individual chefs working inside the same kitchen, sharing the same stove, pantry, and fridge, but each following their own recipe step on their own cutting board.\n\nUses\nMulti-threaded web servers (Java, Go, C++, Node worker threads), browser tabs (Chrome uses separate processes for tabs, multiple threads per tab for rendering and JS).\n\nWatch out\nThreads share memory, so uncoordinated writes cause Race Conditions and Data Corruption. Always use synchronization primitives (Mutex, Semaphores)."
    },
    {
      "title": "CPU Scheduling Algorithms",
      "flow": [
        "Ready Queue",
        "Short-term Scheduler",
        "CPU Core",
        "I/O Wait or Terminate"
      ],
      "body": "The problem before\nIf the CPU only ran tasks in arrival order, a huge 2-hour batch job would block a 5-millisecond keystroke, making the entire computer feel frozen and unresponsive (Convoy Effect).\n\nWhat this is\nCPU Scheduling determines which process in the ready queue gets CPU time. Common algorithms include:\n1. FCFS (First Come First Serve): Non-preemptive, simple, suffers from convoy effect.\n2. SJF / SRTF (Shortest Job First / Shortest Remaining Time First): Provably optimal average waiting time, but suffers from starvation of long jobs.\n3. Round Robin (RR): Preemptive with a fixed Time Quantum (q). Ideal for time-sharing systems.\n4. Priority Scheduling: Processes assigned priority; can lead to starvation (solved by Aging).\n5. Multilevel Feedback Queue (MLFQ): Multiple queues with dynamic priority adjustment based on CPU burst history.\n\nWhat it solves\nMaximizes CPU utilization and throughput while minimizing turnaround time, response time, and waiting time.\n\nReal-life example\nSupermarket checkout. FCFS makes a customer with 1 candy wait behind a cart with 200 items. Round Robin scans 5 items per person, then moves to the next customer in line.\n\nUses\nLinux CFS (Completely Fair Scheduler), Windows scheduler, real-time operating systems (RTOS).\n\nWatch out\nIn Round Robin, if the time quantum is too small, context-switching overhead kills performance. If too large, it degrades into FCFS."
    },
    {
      "title": "Process Synchronization, Mutex & Semaphores",
      "flow": [
        "Entry Section (Lock / Wait)",
        "Critical Section (Shared Data)",
        "Exit Section (Unlock / Signal)",
        "Remainder Section"
      ],
      "body": "The problem before\nTwo threads read balance = 100 at the same time and both subtract 50. Both write back 50 instead of 0. The bank loses money due to a Race Condition.\n\nWhat this is\nA Critical Section is code accessing shared resources that must not be executed concurrently by more than one thread. Requirements: Mutual Exclusion, Progress, Bounded Waiting.\nSynchronization Tools:\n- Mutex: A locking mechanism (ownership). Only the thread that locked it can unlock it (binary 0/1).\n- Semaphore: A signaling mechanism with an integer counter (S).\n  - wait() / P(S): Decrements S. If S <= 0, block.\n  - signal() / V(S): Increments S. Unblocks waiting thread.\n  - Counting Semaphore: Controls access to N instances of a resource.\n  - Binary Semaphore: Behaves like a mutex without ownership semantics.\n\nWhat it solves\nGuarantees deterministic, atomic updates on shared memory across concurrent threads.\n\nReal-life example\nA single toilet with a key (Mutex). Whoever has the key is inside. A parking lot with a digital sign showing available spots (Counting Semaphore).\n\nUses\nDatabase connection pools, message queues, thread-safe collections, operating system kernel drivers.\n\nWatch out\nDeadlocks, priority inversion, and forgetting to release the lock in an error handler."
    },
    {
      "title": "Deadlocks & Coffman Conditions",
      "flow": [
        "Mutual Exclusion",
        "Hold & Wait",
        "No Preemption",
        "Circular Wait"
      ],
      "body": "The problem before\nThread A holds Lock 1 and requests Lock 2. Thread B holds Lock 2 and requests Lock 1. Neither can proceed. Both wait forever and the system hangs.\n\nWhat this is\nA Deadlock is a permanent stall where every process holds a resource while waiting for another resource held by another process in the set.\nFour Coffman Conditions (ALL FOUR must hold simultaneously for a deadlock to exist):\n1. Mutual Exclusion: Resources cannot be shared simultaneously.\n2. Hold and Wait: A process holds at least one resource while waiting for another.\n3. No Preemption: Resources cannot be forcibly taken away; only released voluntarily.\n4. Circular Wait: A closed chain of processes where each waits for a resource held by the next.\n\nHandling Strategies:\n- Prevention: Break at least one of the four Coffman conditions (e.g. strict resource ordering to prevent circular wait).\n- Avoidance: Banker's Algorithm (checks if allocating resources leaves system in a Safe State).\n- Detection & Recovery: Build Resource Allocation Graph (RAG) and check for cycles; kill or preempt processes.\n- Ignorance: The Ostrich Algorithm (reboot if it happens; used in general-purpose OS).\n\nReal-life example\nA gridlocked 4-way street intersection where four cars are stuck nose-to-tail, each blocking the car behind it.\n\nUses\nDatabase row locks, distributed transaction managers, multi-threaded kernel architectures.\n\nWatch out\nNested locks with inconsistent lock acquisition order across different files or functions."
    },
    {
      "title": "Memory Management, Paging & Virtual Memory",
      "flow": [
        "Logical Address (Page # + Offset)",
        "TLB Check (Fast Cache)",
        "Page Table Lookup (RAM)",
        "Physical Address (Frame # + Offset)"
      ],
      "body": "The problem before\nEarly computers required programs to be loaded into contiguous physical RAM. Large programs couldn't run if memory was fragmented, and malicious apps could read each other's data.\n\nWhat this is\nVirtual Memory decouples the logical address space from physical RAM using Paging. The logical address is split into Page Number and Offset. The Memory Management Unit (MMU) uses the Page Table to translate virtual page numbers to physical RAM frame numbers. Translation Lookaside Buffer (TLB) is an on-chip hardware cache for fast address translation.\nWhen a requested page is not in physical RAM, a Page Fault occurs, triggering the OS to fetch the page from disk (swap space) into RAM.\n\nPage Replacement Algorithms:\n- FIFO: Oldest page replaced; suffers from Belady's Anomaly (more frames -> more page faults).\n- LRU (Least Recently Used): Replaces page not used for the longest time; optimal practical choice.\n- Optimal (OPT/Belady): Replaces page that will not be used for the longest time in the future (theoretical benchmark).\n\nWhat it solves\nEnables running programs larger than physical RAM, provides complete memory isolation between processes, and eliminates external fragmentation.\n\nReal-life example\nA library catalog. You ask for Book #402. The librarian looks up the catalog card (Page Table) to find which shelf and aisle (Physical Frame) contains that book. The user never needs to know the warehouse layout.\n\nUses\nDemand paging, copy-on-write (fork), memory mapped files (mmap), shared libraries (DLLs/so).\n\nWatch out\nThrashing: When a computer spends more time swapping pages between RAM and disk than executing instructions, CPU utilization drops to zero."
    }
  ],
  "examples": [
    {
      "title": "Simulating Mutex Lock (JavaScript)",
      "lang": "js",
      "desc": "Simple Mutex to prevent race conditions during async bank balance updates.",
      "code": "class SimpleMutex {\n  constructor() {\n    this.locked = false;\n    this.queue = [];\n  }\n  async lock() {\n    if (this.locked) {\n      await new Promise(resolve => this.queue.push(resolve));\n    }\n    this.locked = true;\n  }\n  unlock() {\n    this.locked = false;\n    if (this.queue.length > 0) {\n      const next = this.queue.shift();\n      next(); // Give lock to next waiting task\n    }\n  }\n}\n\n// Usage:\nlet balance = 100;\nconst mutex = new SimpleMutex();\n\nasync function withdraw(amount) {\n  await mutex.lock(); // Entry Section\n  if (balance >= amount) {\n    balance -= amount; // Critical Section (Safe!)\n    console.log(`Withdrew ${amount}, Remaining: ${balance}`);\n  }\n  mutex.unlock(); // Exit Section\n}"
    },
    {
      "title": "Round Robin Scheduler in JavaScript",
      "lang": "js",
      "desc": "Simulate Round Robin CPU scheduling with a fixed time quantum of 2.",
      "code": "function roundRobin(processes, quantum = 2) {\n  let time = 0;\n  const queue = processes.map(p => ({ ...p, remaining: p.burst }));\n  const log = [];\n\n  while (queue.length > 0) {\n    const current = queue.shift();\n    const runTime = Math.min(quantum, current.remaining);\n    time += runTime;\n    current.remaining -= runTime;\n    log.push(`${current.name} ran for ${runTime}s (Time: ${time}s)`);\n\n    if (current.remaining > 0) {\n      queue.push(current); // Re-queue if not done\n    } else {\n      log.push(`✓ ${current.name} finished at ${time}s`);\n    }\n  }\n  return log;\n}\n\nconst tasks = [{ name: \"P1\", burst: 5 }, { name: \"P2\", burst: 2 }, { name: \"P3\", burst: 3 }];\nconsole.log(roundRobin(tasks, 2));"
    },
    {
      "title": "LRU Page Replacement Algorithm",
      "lang": "js",
      "desc": "Count Page Faults for a reference string using Least Recently Used (LRU) algorithm.",
      "code": "function countLRUPageFaults(pages, capacity) {\n  const memory = []; // RAM frames\n  let pageFaults = 0;\n\n  for (const page of pages) {\n    const idx = memory.indexOf(page);\n    if (idx !== -1) {\n      // Page Hit: Move to most recently used position\n      memory.splice(idx, 1);\n      memory.push(page);\n    } else {\n      // Page Fault!\n      pageFaults++;\n      if (memory.length >= capacity) {\n        memory.shift(); // Evict Least Recently Used (oldest)\n      }\n      memory.push(page);\n    }\n  }\n  return pageFaults;\n}\n\nconst referenceString = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];\nconsole.log(\"LRU Page Faults (3 frames):\", countLRUPageFaults(referenceString, 3)); // 9"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "beginner",
      "q": "What is the difference between a Process and a Thread?",
      "a": "Summary\nQuestion: Process vs Thread\n\nPlain answer:\nA Process is an independent program in execution with its own isolated memory address space, File Descriptors, and Process Control Block (PCB). A Thread is a lightweight execution unit within a process; multiple threads of the same process share the same Code, Data, and Heap memory, but each thread has its own Stack, Program Counter (PC), and CPU Registers.\n\nComparison Table:\n- Memory: Process has isolated memory space; Threads share address space of parent process.\n- Creation Time: Process creation is heavyweight (fork + exec); Thread creation is lightweight.\n- Context Switching: Process switch is slow (flushes TLB and CPU caches); Thread switch is fast (same address space).\n- Communication: IPC required for processes (Pipes, Sockets, Shared Memory); Threads communicate directly via shared memory variables.\n- Crash Impact: If one process crashes, other processes are unaffected; If one thread crashes (e.g. segmentation fault), the whole process dies.\n\nReal-life Example:\nA company office is a process. The employees working inside the office sharing desks and whiteboards are threads. If employee Alice drops her pen, Bob is fine; but if the entire building catches fire, everyone goes down.\n\nCompanies that ask this: Amazon, Microsoft, Google, TCS, Infosys, Cisco, Qualcomm.",
      "code": "// Linux C example: Process vs Thread\n#include <stdio.h>\n#include <unistd.h>\n#include <pthread.h>\n\nint shared_counter = 0; // Shared among threads\n\nvoid* thread_func(void* arg) {\n    shared_counter++; // Direct memory access\n    printf(\"Thread counter: %d\\n\", shared_counter);\n    return NULL;\n}\n\nint main() {\n    pthread_t t1;\n    pthread_create(&t1, NULL, thread_func, NULL);\n    pthread_join(t1, NULL);\n    return 0;\n}"
    },
    {
      "id": 2,
      "level": "intermediate",
      "q": "What are the four Coffman conditions for a Deadlock, and how do you prevent them?",
      "a": "Summary\nQuestion: Deadlock Coffman Conditions & Prevention\n\nPlain answer:\nA deadlock occurs when two or more processes are blocked forever, waiting for resources held by each other. For a deadlock to occur, all four Coffman conditions must hold simultaneously:\n\n1. Mutual Exclusion: At least one resource must be held in a non-shareable mode (only one process at a time).\n   - Prevention: Make resources shareable (e.g. read-only files, spooling for printers).\n\n2. Hold and Wait: A process holds at least one resource and is waiting to acquire additional resources held by others.\n   - Prevention: Require a process to request all needed resources at once before execution, or release all held resources before requesting new ones.\n\n3. No Preemption: Resources cannot be forcibly taken away; only released voluntarily after completion.\n   - Prevention: If a process holding resources is denied a new request, forcibly preempt (take back) all its allocated resources.\n\n4. Circular Wait: A closed chain of processes P0 -> P1 -> P2 -> ... -> P0 exists such that each waits for a resource held by the next.\n   - Prevention (Most Practical): Impose a total global ordering of all resource types. A process can only request resources in strictly increasing numerical order.\n\nCompanies that ask this: Amazon, Google, Adobe, Oracle, Flipkart, Samsung.",
      "code": "// Deadlock prevention via Resource Ordering:\n// Always acquire Lock A (Resource 1) before Lock B (Resource 2)\nvoid safe_transfer(Account* from, Account* to, double amount) {\n    Account* first = from->id < to->id ? from : to;\n    Account* second = from->id < to->id ? to : from;\n\n    pthread_mutex_lock(&first->lock);  // Always lower ID first\n    pthread_mutex_lock(&second->lock); // Then higher ID\n\n    from->balance -= amount;\n    to->balance += amount;\n\n    pthread_mutex_unlock(&second->lock);\n    pthread_mutex_unlock(&first->lock);\n}"
    },
    {
      "id": 3,
      "level": "intermediate",
      "q": "What is Paging, Virtual Memory, and how does a Page Fault work?",
      "a": "Summary\nQuestion: Virtual Memory, Paging, and Page Faults\n\nPlain answer:\nVirtual Memory is a memory management technique that gives a process the illusion of having a large, continuous block of memory, even if physical RAM is small and fragmented.\n\nKey Concepts:\n1. Paging: Logical memory is divided into fixed-size blocks called Pages (usually 4KB). Physical memory is divided into same-sized blocks called Frames.\n2. Page Table: Maintained per process by the OS to map Virtual Page Numbers (VPN) to Physical Frame Numbers (PFN). Includes a Valid/Invalid bit.\n3. TLB (Translation Lookaside Buffer): Fast hardware cache in the MMU that caches recent page translations for speed.\n4. Page Fault Handling Steps:\n   - CPU accesses a virtual address.\n   - MMU checks TLB and Page Table; if the Valid bit is 0 (page not in RAM), a Page Fault Trap is triggered to the OS kernel.\n   - The OS pauses the process and saves its state.\n   - The OS locates the required page on the secondary storage (Swap space / disk).\n   - The OS finds a free physical frame in RAM (or evicts a victim frame using LRU/FIFO if RAM is full).\n   - Disk I/O reads the page into the physical frame.\n   - The OS updates the Page Table (sets Valid bit = 1, Frame #).\n   - The OS restarts the interrupted instruction.\n\nCompanies that ask this: Microsoft, Google, Apple, Qualcomm, Nvidia, Intel.",
      "code": "// Logical Address to Physical Address calculation:\n// Address: 32-bit, Page Size = 4KB (2^12 bytes)\n// Offset = lower 12 bits\n// Page Number = upper 20 bits\n\nuint32_t logical_address = 0x00403124;\nuint32_t page_offset = logical_address & 0x00000FFF; // 0x124\nuint32_t page_number = logical_address >> 12;         // 0x00403\n\n// MMU checks Page Table:\n// Physical Frame = PageTable[page_number].frame (e.g. 0x0001A)\n// Physical Address = (0x0001A << 12) | page_offset -> 0x0001A124"
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "What is the difference between Mutex and Semaphore?",
      "a": "Summary\nQuestion: Mutex vs Semaphore\n\nPlain answer:\nBoth are synchronization primitives used to prevent race conditions in concurrent programming, but they serve different purposes:\n\n1. Ownership:\n   - Mutex (Mutual Exclusion Object): Has an owner. Only the exact thread that locked the mutex is allowed to unlock it.\n   - Semaphore: Has no concept of ownership. Any thread can signal (increment) or wait (decrement) on a semaphore.\n\n2. Values / Types:\n   - Mutex: Binary state only (Locked / 0 or Unlocked / 1).\n   - Binary Semaphore: Values 0 and 1; used like a lock, but can be signaled from another thread.\n   - Counting Semaphore: Integer value >= 0 representing available resource instances (e.g., 5 database connections).\n\n3. Primary Use Case:\n   - Mutex: Protecting a Critical Section of code from concurrent modification.\n   - Semaphore: Signaling between threads (e.g., Producer-Consumer: Producer signals 'item ready', Consumer waits).\n\nReal-life Analogy:\nA Mutex is a key to a single bathroom. You lock it, use it, and unlock it. A Semaphore is a parking garage ticket counter: cars take a ticket when entering (wait), and when a car leaves, the counter goes up (signal).\n\nCompanies that ask this: Amazon, Microsoft, TCS, Wipro, Uber, Atlassian.",
      "code": "// Producer-Consumer with Semaphores\n#include <semaphore.h>\n#include <pthread.h>\n\nsem_t empty_slots; // initialized to BUFFER_SIZE\nsem_t full_slots;  // initialized to 0\npthread_mutex_t mutex; // protects buffer\n\nvoid* producer(void* arg) {\n    while (1) {\n        int item = produce_item();\n        sem_wait(&empty_slots); // wait if buffer full\n        pthread_mutex_lock(&mutex);\n        insert_item(item);\n        pthread_mutex_unlock(&mutex);\n        sem_post(&full_slots);  // signal consumer\n    }\n}"
    },
    {
      "id": 5,
      "level": "beginner",
      "q": "What is a Zombie Process vs an Orphan Process in Linux/OS?",
      "a": "Summary\nQuestion: Zombie vs Orphan Process\n\nPlain answer:\n\n1. Zombie Process (Defunct):\n   - A process that has completed execution (called exit()), but its entry still remains in the Process Table because its parent process has not yet read its exit status code via the wait() or waitpid() system call.\n   - State: 'Z' in ps / top.\n   - Resources consumed: Zero CPU and RAM, but consumes a PID slot in the OS process table.\n   - Fix: Parent must call wait(), or kill the parent so init/systemd (PID 1) adopts and reaps the zombie.\n\n2. Orphan Process:\n   - A running process whose parent process has terminated or crashed before the child finished executing.\n   - State: Running normally.\n   - Resolution: The OS kernel automatically re-parents the orphan to `init` or `systemd` (PID 1). When the orphan terminates, init calls wait() immediately to prevent it from becoming a persistent zombie.\n\nCompanies that ask this: Amazon, Red Hat, Cisco, Oracle, Infosys.",
      "code": "// Creating a Zombie Process in C:\n#include <stdio.h>\n#include <stdlib.h>\n#include <unistd.h>\n\nint main() {\n    pid_t pid = fork();\n    if (pid > 0) {\n        // Parent sleeps without calling wait()\n        printf(\"Parent PID %d sleeping...\\n\", getpid());\n        sleep(30);\n    } else if (pid == 0) {\n        // Child exits immediately -> Becomes Zombie\n        printf(\"Child PID %d exiting...\\n\", getpid());\n        exit(0);\n    }\n    return 0;\n}"
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "Explain CPU Scheduling Algorithms: FCFS, SJF, Round Robin, Priority, and Belady's Anomaly.",
      "a": "Summary\nQuestion: CPU Scheduling Algorithms Comparison\n\nPlain answer:\nCPU Scheduling selects which process in the ready queue receives CPU execution time.\n\n1. First-Come First-Served (FCFS):\n   - Non-preemptive. Simple FIFO queue.\n   - Pitfall: Convoy Effect (short I/O-bound processes wait behind a long CPU-bound process, tanking throughput).\n\n2. Shortest Job First (SJF / SRTF):\n   - Preemptive version is Shortest Remaining Time First (SRTF).\n   - Gives minimum average waiting time.\n   - Pitfall: Impossible to know exact burst time in advance; Starvation of long processes.\n\n3. Round Robin (RR):\n   - Preemptive. Each process gets a fixed Time Quantum (q). If not finished, it is sent to the back of the ready queue.\n   - Best for interactive/time-sharing systems.\n\n4. Priority Scheduling:\n   - Process with highest priority runs first. Can be preemptive or non-preemptive.\n   - Problem: Starvation (indefinite blocking).\n   - Solution: Aging (gradually increasing the priority of processes waiting for long periods).\n\nWhat is Belady's Anomaly?\nBelady's Anomaly is a counter-intuitive phenomenon in Paging where increasing the number of physical page frames results in an INCREASE in the number of page faults. It occurs in FIFO page replacement, but NEVER in stack-based algorithms like LRU or Optimal.\n\nCompanies that ask this: Google, Amazon, Microsoft, TCS, Cognizant.",
      "code": "// Round Robin simulation concept:\n// Time Quantum = 2 units\n// Queue: [P1(burst 5), P2(burst 2), P3(burst 3)]\n// Time 0-2: P1 runs (remaining 3) -> Queue: [P2, P3, P1]\n// Time 2-4: P2 runs (remaining 0, Done!) -> Queue: [P3, P1]\n// Time 4-6: P3 runs (remaining 1) -> Queue: [P1, P3]\n// Time 6-8: P1 runs (remaining 1) -> Queue: [P3, P1]"
    },
    {
      "id": 7,
      "level": "advanced",
      "q": "What is Thrashing in OS, and how is it prevented?",
      "a": "Summary\nQuestion: Thrashing & Working Set Model\n\nPlain answer:\nThrashing occurs when a computer spends more time swapping pages into and out of RAM (paging I/O) than executing actual program instructions. As page faults skyrocket, CPU utilization plummets toward zero because all processes are queued waiting for disk I/O.\n\nWhy Thrashing Happens:\n1. Too many active processes loaded in memory (degree of multiprogramming is too high).\n2. Sum of Working Sets of all active processes exceeds total available physical RAM.\n3. The OS scheduler sees low CPU utilization and mistakenly spawns even more processes, making the crisis worse.\n\nHow to Prevent Thrashing:\n1. Working Set Model (Peter Denning): The working set W(t, Δ) is the set of pages referenced by a process in the most recent Δ time units. The OS only allocates CPU time to a process if all pages in its working set fit in physical RAM.\n2. Page Fault Frequency (PFF): Set upper and lower thresholds for page fault rates. If a process exceeds the upper threshold, allocate it more frames; if below lower threshold, remove frames.\n3. Reduce Degree of Multiprogramming: Suspend (swap out) one or more processes entirely to free up RAM.\n\nCompanies that ask this: Microsoft, Amazon, Intel, VMware.",
      "code": "// Concept: Working Set Model\n// If Σ (WorkingSetSize(Pi)) > Total_RAM_Frames:\n//   Trigger Process Swapper (suspend lowest priority process)\n// Else:\n//   Safe state, all processes execute without thrashing"
    },
    {
      "id": 8,
      "level": "intermediate",
      "q": "What are System Calls, and how does fork(), exec(), and wait() work in Unix/Linux?",
      "a": "Summary\nQuestion: fork(), exec(), wait() System Calls\n\nPlain answer:\nSystem Calls are programmatic requests from user space to the OS kernel for hardware and OS services (file I/O, process creation, networking).\n\nKey Process Creation System Calls:\n1. fork(): Creates an exact duplicate child process.\n   - Returns 0 to the child process.\n   - Returns Child's PID (> 0) to the parent process.\n   - Returns -1 on failure.\n   - Uses Copy-on-Write (COW) so physical memory pages are only duplicated when one process modifies them.\n\n2. exec() family (execvp, execl, etc.): Replaces the current process's memory space, code, data, and stack with a brand-new executable binary. The PID remains unchanged.\n\n3. wait() / waitpid(): Suspends the calling parent process until one of its child processes terminates, returning the child's exit status and allowing the OS to clean up the child's PCB (preventing zombies).\n\nCompanies that ask this: Google, Amazon, Cisco, Qualcomm, Red Hat.",
      "code": "#include <stdio.h>\n#include <unistd.h>\n#include <sys/wait.h>\n\nint main() {\n    pid_t pid = fork(); // Clone process\n\n    if (pid == 0) {\n        // Child code: replace with /bin/ls\n        char *args[] = {\"ls\", \"-l\", NULL};\n        execvp(\"ls\", args);\n    } else if (pid > 0) {\n        // Parent code: wait for child to finish\n        int status;\n        waitpid(pid, &status, 0);\n        printf(\"Child process completed.\\n\");\n    }\n    return 0;\n}"
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "What is Inter-Process Communication (IPC)? Explain Pipes, Shared Memory, and Message Queues.",
      "a": "Summary\nQuestion: Inter-Process Communication (IPC)\n\nPlain answer:\nBecause processes have isolated memory address spaces, they cannot directly access each other's variables. IPC mechanisms allow processes to communicate and synchronize.\n\nMain IPC Mechanisms:\n1. Pipes & Named Pipes (FIFOs):\n   - Unidirectional data channel.\n   - Anonymous pipe: Used between parent and child processes (`int fd[2]; pipe(fd);`).\n   - Named Pipe (FIFO): Has a file system path; can be used by unrelated processes.\n\n2. Shared Memory:\n   - The fastest IPC mechanism. The OS maps a region of physical RAM into the address spaces of multiple processes.\n   - Processes read and write directly to memory without kernel copy overhead.\n   - Requires synchronization (Mutex/Semaphores) to prevent race conditions.\n\n3. Message Queues:\n   - Stored in kernel memory. Processes write structured messages to a queue, and another reads them asynchronously.\n\n4. Sockets:\n   - Network IPC. Allows communication between processes on the same machine or across the internet using IP addresses and Port numbers.\n\nCompanies that ask this: Amazon, Apple, Cisco, Qualcomm, TCS.",
      "code": "// Linux IPC Pipe in C:\n#include <stdio.h>\n#include <unistd.h>\n\nint main() {\n    int fd[2]; // fd[0]=read, fd[1]=write\n    pipe(fd);\n    if (fork() == 0) {\n        close(fd[0]);\n        write(fd[1], \"Hello from Child\", 16); // Send\n    } else {\n        close(fd[1]);\n        char buf[20];\n        read(fd[0], buf, sizeof(buf)); // Receive\n        printf(\"Parent got: %s\\n\", buf);\n    }\n    return 0;\n}"
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "What is a Context Switch in Operating Systems?",
      "a": "Summary\nQuestion: CPU Context Switch\n\nPlain answer:\nA Context Switch is the process where the CPU stops executing one process/thread, saves its current execution state (Program Counter, CPU registers, stack pointer) into its Process Control Block (PCB), and loads the saved state of another process from its PCB to start executing it.\n\nTriggers for Context Switch:\n1. Preemptive CPU Scheduler (Time Quantum expired in Round Robin).\n2. Higher priority process becomes Ready.\n3. Current process issues a blocking I/O request (disk or network read).\n4. Hardware interrupt occurred.\n\nWhy Context Switching is Pure Overhead:\n- The CPU executes zero user instructions while switching.\n- Involves kernel trap, saving/restoring registers, flushing Translation Lookaside Buffer (TLB), and CPU cache misses for the incoming process.\n- Thread context switch is much cheaper than process context switch because memory mappings and TLB remain unchanged.\n\nCompanies that ask this: Microsoft, Google, Intel, AMD, Infosys.",
      "code": "// Conceptual Context Switch State Save:\n// 1. Interrupt fires\n// 2. CPU saves PC & Registers -> PCB_P1\n// 3. Scheduler chooses P2\n// 4. CPU loads Registers & PC <- PCB_P2\n// 5. Execution resumes in P2"
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "What is the Critical Section Problem and Peterson's Algorithm?",
      "a": "Summary\nQuestion: Critical Section & Peterson's Algorithm\n\nPlain answer:\nA Critical Section is a segment of code where shared resources (variables, files) are accessed. To avoid race conditions, any valid solution must satisfy three strict criteria:\n1. Mutual Exclusion: If process Pi is executing in its critical section, no other processes can be executing in their critical sections.\n2. Progress: If no process is executing in its critical section, only processes wishing to enter can participate in deciding who enters next.\n3. Bounded Waiting: There must be a bound on the number of times other processes can enter their critical sections after a process has made a request.\n\nPeterson's Algorithm:\nA classic software-based solution for two processes (P0 and P1) using two shared variables:\n- `boolean flag[2]`: `flag[i] = true` means Pi is ready to enter.\n- `int turn`: Indicates whose turn it is to enter.",
      "code": "// Peterson's Algorithm for Process 0 (i=0, j=1):\nflag[0] = true; // I want to enter\nturn = 1;       // Be polite: give other process the turn\nwhile (flag[1] && turn == 1) {\n    // Busy wait\n}\n// --- CRITICAL SECTION ---\nflag[0] = false; // Exit Section"
    },
    {
      "id": 12,
      "level": "advanced",
      "q": "Explain Banker's Algorithm for Deadlock Avoidance with Safe State detection.",
      "a": "Summary\nQuestion: Banker's Algorithm\n\nPlain answer:\nBanker's Algorithm (Edsger Dijkstra) is a deadlock avoidance algorithm used by the OS before granting resource requests. It simulates resource allocation and tests whether granting the request leaves the system in a 'Safe State' (a state where there exists a Safe Sequence in which every process can finish without deadlocking).\n\nData Structures:\n1. Available[m]: Available instances of each resource type.\n2. Max[n][m]: Maximum demand of each process.\n3. Allocation[n][m]: Resources currently allocated to each process.\n4. Need[n][m] = Max[n][m] - Allocation[n][m]: Remaining resources needed.\n\nSafety Algorithm:\nFind a process Pi whose `Need[i] <= Available`. If found, assume Pi finishes, add its `Allocation[i]` back to `Available`, and repeat until all processes complete.",
      "code": "// Banker's Safety Condition Check:\n// If Need[i] <= Available:\n//   Available += Allocation[i]\n//   Finish[i] = true\n// If all Finish[i] == true -> SAFE SEQUENCE exists!"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "What is the difference between Internal and External Fragmentation?",
      "a": "Summary\nQuestion: Internal vs External Fragmentation\n\nPlain answer:\n\n1. Internal Fragmentation:\n   - Occurs when memory is allocated in fixed-size blocks (e.g., Paging with 4KB pages).\n   - If a process requests 5KB, it gets two 4KB pages (8KB total). The remaining 3KB inside the second page is unused and wasted.\n   - Memory is internal to the partition.\n\n2. External Fragmentation:\n   - Occurs when variable-sized contiguous memory allocation is used (e.g., Segmentation).\n   - Over time, as processes allocate and free memory, small scattered free holes develop throughout RAM. Total free memory is enough for a new process, but it cannot be used because it is not contiguous.\n   - Solution: Paging (non-contiguous memory allocation) or Compaction (defragmentation).\n\nCompanies that ask this: Microsoft, Amazon, Qualcomm, Intel.",
      "code": "// Internal Fragmentation Example:\n// Page Size = 4096 bytes\n// Process needs = 5000 bytes\n// Allocated = 2 pages (8192 bytes)\n// Internal Waste = 8192 - 5000 = 3192 bytes"
    },
    {
      "id": 14,
      "level": "intermediate",
      "q": "What is an Inode, and what is the difference between a Hard Link and a Soft Link (Symlink)?",
      "a": "Summary\nQuestion: Inodes, Hard Links vs Soft Links\n\nPlain answer:\nAn Inode (Index Node) is a data structure on Unix/Linux file systems that stores all metadata about a file (file size, permissions, owner, timestamps, and disk block pointers), EXCEPT the filename and actual file data.\n\nHard Link vs Soft Link (Symlink):\n1. Hard Link:\n   - A direct directory pointer to an existing Inode number.\n   - Shares the exact same Inode number and disk blocks as the original file.\n   - If the original file is deleted, the data remains accessible through the hard link until all link references reach 0.\n   - Cannot link across different file systems or partitions; cannot link directories.\n\n2. Soft Link (Symbolic Link / Symlink):\n   - A separate independent file with its own unique Inode number.\n   - Contains only the path string pointing to the target file (like a Windows shortcut).\n   - If the original file is deleted, the symlink breaks (Dangling link).\n   - Can link across different file systems and link directories.\n\nCompanies that ask this: Red Hat, Amazon, Cisco, Google.",
      "code": "# Linux Link Commands:\nln target.txt hardlink.txt   # Hard Link (Same Inode)\nln -s target.txt symlink.txt # Soft Link (New Inode)\nls -i target.txt hardlink.txt symlink.txt # View Inode numbers"
    },
    {
      "id": 15,
      "level": "intermediate",
      "q": "Explain Monolithic Kernel vs Microkernel architecture.",
      "a": "Summary\nQuestion: Monolithic Kernel vs Microkernel\n\nPlain answer:\n\n1. Monolithic Kernel (e.g. Linux, traditional Unix):\n   - All core OS services (Process Management, Memory Management, File Systems, Device Drivers, Network Stacks) run together in a single privileged Kernel Address Space (Ring 0).\n   - Pros: Extremely fast because components communicate via direct C function calls.\n   - Cons: A bug or crash in a third-party device driver can bring down the entire OS.\n\n2. Microkernel (e.g. Minix, Mach, QNX, Fuchsia):\n   - Only the absolute minimum essential services (IPC, basic scheduling, low-level memory management) run in Kernel Space.\n   - Device drivers, file systems, and network protocols run as separate user-space processes (servers).\n   - Pros: Highly reliable and secure (if file system crashes, it restarts without crashing the OS).\n   - Cons: Slower performance due to frequent IPC context switching between user space and kernel space.\n\nCompanies that ask this: Apple, Google, Qualcomm, Huawei.",
      "code": "// Architecture summary:\n// Monolithic: [Drivers + FS + VFS + Network + Scheduler] in Kernel Ring 0\n// Microkernel: [IPC + Basic Scheduler] in Kernel Ring 0; [Drivers, FS] in User Ring 3"
    },
    {
      "id": 16,
      "level": "intermediate",
      "q": "What is the Dining Philosophers Problem and how is it solved?",
      "a": "Summary\nQuestion: Dining Philosophers Problem\n\nPlain answer:\nThe Dining Philosophers Problem (Dijkstra) illustrates deadlock and resource starvation in concurrent systems.\n\nScenario: 5 philosophers sit around a circular table with 5 chopsticks and a bowl of rice. A philosopher must think, pick up 2 adjacent chopsticks (left and right), eat, and put them down. If all 5 philosophers pick up their left chopstick simultaneously, all wait forever for their right chopstick -> DEADLOCK.\n\nSolutions:\n1. Resource Ordering: Number chopsticks 0 to 4. Philosophers 0-3 pick lower number chopstick first. Philosopher 4 picks chopstick 0 before 4 (Breaks circular wait).\n2. Allow at most 4 philosophers to sit at the table simultaneously using a semaphore initialized to 4.\n3. Asymmetric solution: Odd philosophers pick left first, even philosophers pick right first.",
      "code": "// Solution using Asymmetric Chopstick Pick:\nvoid eat(int i) {\n    if (i % 2 == 0) {\n        sem_wait(&chopstick[i]);          // Left\n        sem_wait(&chopstick[(i + 1) % 5]); // Right\n    } else {\n        sem_wait(&chopstick[(i + 1) % 5]); // Right\n        sem_wait(&chopstick[i]);          // Left\n    }\n    // Eat...\n    sem_post(&chopstick[i]);\n    sem_post(&chopstick[(i + 1) % 5]);\n}"
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "What is the Producer-Consumer (Bounded Buffer) problem?",
      "a": "Summary\nQuestion: Producer-Consumer Problem\n\nPlain answer:\nA classic synchronization problem where a Producer thread generates data items into a fixed-size buffer, and a Consumer thread removes items from the buffer.\n\nRules:\n1. Producer must not insert into a full buffer.\n2. Consumer must not remove from an empty buffer.\n3. Access to the shared buffer must be mutually exclusive.\n\nSolved using three synchronization primitives:\n- `mutex`: Binary semaphore (init 1) to protect buffer access.\n- `empty`: Counting semaphore (init N) tracking empty slots.\n- `full`: Counting semaphore (init 0) tracking filled items.",
      "code": "// Producer code:\nsem_wait(&empty); // Decrement empty slots\npthread_mutex_lock(&mutex);\nbuffer[in] = item; in = (in + 1) % N;\npthread_mutex_unlock(&mutex);\nsem_post(&full);  // Increment filled count\n\n// Consumer code:\nsem_wait(&full);  // Decrement filled count\npthread_mutex_lock(&mutex);\nitem = buffer[out]; out = (out + 1) % N;\npthread_mutex_unlock(&mutex);\nsem_post(&empty); // Increment empty slots"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "What is the Readers-Writers Problem and how do you prevent Reader/Writer Starvation?",
      "a": "Summary\nQuestion: Readers-Writers Problem\n\nPlain answer:\nA synchronization problem where multiple threads access a shared database:\n- Any number of Readers can read simultaneously.\n- Only ONE Writer can write at a time (no readers or other writers allowed).\n\nStarvation Issue:\n- First Readers-Writers Problem: Readers have priority. If a continuous stream of readers arrives, a waiting writer starves indefinitely.\n- Second Readers-Writers Problem (Writer Priority): When a writer arrives, no new readers can start reading until the writer finishes.",
      "code": "// Reader Preference Pattern in C:\nint read_count = 0;\npthread_mutex_t count_mutex, write_lock;\n\nvoid* reader(void* arg) {\n    pthread_mutex_lock(&count_mutex);\n    read_count++;\n    if (read_count == 1) pthread_mutex_lock(&write_lock); // First reader locks writer\n    pthread_mutex_unlock(&count_mutex);\n\n    // READ DATABASE...\n\n    pthread_mutex_lock(&count_mutex);\n    read_count--;\n    if (read_count == 0) pthread_mutex_unlock(&write_lock); // Last reader unlocks writer\n    pthread_mutex_unlock(&count_mutex);\n}"
    },
    {
      "id": 19,
      "level": "beginner",
      "q": "What are the segments in the Memory Layout of a C / C++ program?",
      "a": "Summary\nQuestion: C Program Memory Layout\n\nPlain answer:\nA compiled program's virtual memory address space is divided into 5 standard segments (from high to low address):\n\n1. Stack: Stores function call frames, local variables, return addresses, and CPU register saves. Grows DOWNWARD toward lower addresses. Fast and automatically deallocated when a function returns.\n2. Heap: Dynamic memory allocated at runtime via `malloc()`, `calloc()`, or `new`. Managed manually by developer (`free()` / `delete`) or Garbage Collector. Grows UPWARD.\n3. BSS (Block Started by Symbol): Uninitialized global and static variables. Automatically initialized to zero by the OS loader.\n4. Data Segment (Initialized Data): Global and static variables explicitly initialized with non-zero values (`int count = 10;`).\n5. Text / Code Segment: Read-only compiled machine code instructions.",
      "code": "#include <stdio.h>\n#include <stdlib.h>\n\nint global_init = 10;   // Data Segment\nint global_uninit;      // BSS Segment\n\nint main() {\n    int local_var = 5;  // Stack Segment\n    int *ptr = (int*) malloc(sizeof(int)); // Heap Segment\n    free(ptr);\n    return 0;\n}"
    },
    {
      "id": 20,
      "level": "beginner",
      "q": "What is the difference between Preemptive and Non-Preemptive Scheduling?",
      "a": "Summary\nQuestion: Preemptive vs Non-Preemptive Scheduling\n\nPlain answer:\n\n1. Preemptive Scheduling:\n   - The OS can forcibly interrupt and suspend a running process in favor of a higher-priority or time-sliced process.\n   - Process transitions from Running -> Ready state.\n   - Examples: Round Robin, Shortest Remaining Time First (SRTF), Priority Preemptive.\n   - Pros: High responsiveness, prevents greedy processes from hogging the CPU.\n   - Cons: Context switching overhead and complex synchronization requirements.\n\n2. Non-Preemptive Scheduling:\n   - Once the CPU is allocated to a process, the process keeps the CPU until it terminates or voluntarily blocks for I/O.\n   - Process transitions only from Running -> Terminated or Running -> Waiting.\n   - Examples: FCFS, Shortest Job First (non-preemptive SJF).\n   - Pros: Simple with minimal context switching.\n   - Cons: Poor response time (Convoy effect).",
      "code": "// Scheduling Comparison:\n// Non-preemptive: Process runs until return 0; or read() blocks\n// Preemptive: Timer hardware interrupt forces context switch every 10ms"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "What is Copy-on-Write (COW) and how does it optimize fork()?",
      "a": "Summary\nQuestion: Copy-on-Write (COW) in OS\n\nPlain answer:\nWhen a parent process calls `fork()`, creating an exact physical memory copy of all pages for the child process would be extremely slow and wasteful, especially if the child immediately calls `exec()` to replace its program.\n\nHow Copy-on-Write works:\n1. `fork()` duplicates only the Page Table entries, pointing both parent and child page tables to the SAME physical memory frames in RAM.\n2. All shared pages are marked as Read-Only in both page tables.\n3. As long as both processes only read data, zero memory duplication occurs.\n4. If either parent or child attempts to WRITE to a shared page, an MMU page protection trap occurs.\n5. The OS allocates a new physical frame, copies the single 4KB page, and updates the writing process's page table with Write permissions.\n\nCompanies that ask this: Google, Amazon, Apple, Meta, Red Hat.",
      "code": "// Fork with COW behavior:\npid_t pid = fork();\nif (pid == 0) {\n    // Reads use shared physical RAM pages\n    // First write duplicates ONLY that single 4KB page\n    execvp(\"ls\", args);\n}"
    }
  ]
};
