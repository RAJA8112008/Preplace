window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA.java = {
  kind: "practice",
  lang: "java",
  notes: [
    {
      title: "Method References (:: in Java)",
      body: "What this is\nIntroduced in Java 8, the Method Reference operator `::` provides a compact, readable shorthand for lambda expressions that simply call an existing method by name.\n\n4 Types of Method References:\n1. Static Method: `ClassName::staticMethod` (e.g. `Math::max` instead of `(a, b) -> Math.max(a, b)`)\n2. Instance Method of an Arbitrary Object: `String::toUpperCase` instead of `s -> s.toUpperCase()`\n3. Instance Method of a Specific Object: `System.out::println` instead of `x -> System.out.println(x)`\n4. Constructor Reference: `ClassName::new` (e.g. `ArrayList::new` instead of `() -> new ArrayList<>()`)\n\nReal-life example\nGiving someone an address instead of driving them to the destination step by step.\n\nWhat it solves\nEliminates boilerplate lambda syntax and enhances functional pipeline readability in Java Streams."
    },
    {
      title: "JVM Memory Architecture (Stack vs Heap)",
      body: "What this is\nThe Java Virtual Machine (JVM) divides memory into distinct logical areas:\n• Stack Memory: Stores local primitive variables and references to heap objects. Each thread has its own private stack. Memory is allocated and freed automatically when methods enter and exit (LIFO).\n• Heap Memory: Stores all instantiated objects (`new Object()`) and instance variables. Shared across all threads. Managed by the Garbage Collector (GC).\n• Metaspace: Stores class metadata, bytecode, static variables, and the runtime constant pool (outside JVM heap, in native memory).\n\nReal-life example\n• Stack: A waiter's notepad holding table orders for right now.\n• Heap: The restaurant kitchen pantry storing all cooked dishes and ingredients."
    },
    {
      title: "String Immutability & String Pool",
      body: "What this is\nStrings in Java are immutable — once created, their character contents cannot be altered in memory.\n\nString Constant Pool (SCP):\nWhen a string literal is created (`String s = \"hello\";`), the JVM checks the String Pool in heap. If it already exists, the existing reference is returned. If `new String(\"hello\")` is used, a new object is created on the heap outside the pool.\n\nStringBuilder vs StringBuffer:\n• `StringBuilder`: Mutable and fast (non-thread-safe).\n• `StringBuffer`: Mutable and thread-safe (`synchronized` methods, slower)."
    },
    {
      title: "final vs finally vs finalize",
      body: "What this is\nOne of the most frequently asked Java interview distinctions:\n1. `final` keyword:\n   • `final` variable: Constant value; cannot be reassigned.\n   • `final` method: Cannot be overridden by subclasses.\n   • `final` class: Cannot be extended/inherited (e.g. `java.lang.String`).\n2. `finally` block:\n   • A block following `try-catch` that always executes (used to close streams/connections), even if an exception occurs.\n3. `finalize()` method:\n   • A deprecated method in `java.lang.Object` invoked by the Garbage Collector before reclaiming object memory."
    }
  ],
  questions: [
    {
      id: 1,
      level: "beginner",
      q: "What is the method reference operator :: in Java?",
      a: "What this is\nThe `::` operator in Java is the Method Reference operator introduced in Java 8. It allows referencing a method or constructor directly without invoking it, acting as a cleaner shorthand for lambda expressions.\n\n4 Forms:\n• 1. `ClassName::staticMethod` (e.g. `Integer::parseInt`)\n• 2. `instance::instanceMethod` (e.g. `System.out::println`)\n• 3. `ClassName::instanceMethod` (e.g. `String::length`)\n• 4. `ClassName::new` (Constructor reference)",
      code: `import java.util.*;
import java.util.stream.*;

public class MethodRefDemo {
    public static void main(String[] args) {
        List<String> names = Arrays.asList("Alice", "Bob", "Charlie");

        // Lambda syntax:
        names.forEach(s -> System.out.println(s));

        // Method reference syntax (::):
        names.forEach(System.out::println);

        // String method reference:
        List<String> upper = names.stream()
                                  .map(String::toUpperCase)
                                  .collect(Collectors.toList());

        System.out.println(upper); // [ALICE, BOB, CHARLIE]
    }
}`,
      ask: "Most asked · Amazon · Oracle · TCS · Infosys"
    },
    {
      id: 2,
      level: "beginner",
      q: "What is the difference between JDK, JRE, and JVM?",
      a: "What this is\n• JVM (Java Virtual Machine): The execution engine that runs Java bytecode (`.class` files) and translates them into machine code for the host OS.\n• JRE (Java Runtime Environment): JVM + Core libraries required to RUN Java applications.\n• JDK (Java Development Kit): JRE + Development tools (`javac` compiler, debugger `jdb`, archiver `jar`) required to WRITE and COMPILE Java programs.",
      code: `// Simple Java class compiled with 'javac Hello.java' (JDK)
// and executed on JVM through 'java Hello' (JRE)
public class Hello {
    public static void main(String[] args) {
        System.out.println("JVM Architecture: Platform Independent Bytecode!");
    }
}`,
      ask: "Most asked · TCS · Wipro · Amazon · Microsoft"
    },
    {
      id: 3,
      level: "beginner",
      q: "Stack vs Heap memory in Java?",
      a: "What this is\n• Stack Memory: Stores local variables, primitive data types, and reference variables. Private to each thread (LIFO). Fast, allocated/freed automatically on method calls.\n• Heap Memory: Stores all created objects (`new`) and class instance variables. Shared across all threads. Managed and reclaimed by the Garbage Collector (GC).\n• OutOfMemoryError occurs when Heap is full; StackOverflowError occurs when Stack depth exceeds limit (e.g. infinite recursion).",
      code: `public class MemoryDemo {
    // Stored in Heap with the object
    int instanceVar = 42; 

    public void calculate() {
        // Stored in Stack (local variable)
        int localPrimitive = 10; 
        
        // 'obj' reference lives in Stack; actual memory lives in Heap
        MemoryDemo obj = new MemoryDemo(); 
    }

    public static void main(String[] args) {
        new MemoryDemo().calculate();
    }
}`,
      ask: "Most asked · Amazon · Google · Microsoft · Adobe"
    },
    {
      id: 4,
      level: "beginner",
      q: "Why is String immutable in Java and what is String Constant Pool?",
      a: "What this is\nStrings are immutable (cannot be modified) for three vital reasons:\n1. Security: Strings are widely used for DB passwords, network URLs, and file paths. Immutability prevents malicious tampering.\n2. Thread Safety: Immutable objects are inherently thread-safe without synchronization.\n3. String Constant Pool (SCP): Allows JVM to share identical string literals across the entire application to save memory.\n\n`==` checks object memory address reference; `.equals()` checks string character content.",
      code: `public class StringDemo {
    public static void main(String[] args) {
        String s1 = "Hello";              // Created in String Pool
        String s2 = "Hello";              // Reuses pool instance
        String s3 = new String("Hello");  // Forces new Heap object

        System.out.println(s1 == s2);      // true (same pool reference)
        System.out.println(s1 == s3);      // false (different heap addresses)
        System.out.println(s1.equals(s3)); // true (same character content)
    }
}`,
      ask: "Most asked · Amazon · Oracle · Microsoft · TCS"
    },
    {
      id: 5,
      level: "beginner",
      q: "String vs StringBuilder vs StringBuffer?",
      a: "What this is\n• `String`: Immutable. Every concatenation (`+`) creates a brand-new object in memory.\n• `StringBuilder`: Mutable and fast. Not thread-safe (recommended for single-threaded loops).\n• `StringBuffer`: Mutable and thread-safe. Uses `synchronized` methods, incurring slight overhead.",
      code: `public class BufferDemo {
    public static void main(String[] args) {
        // Inefficient: creates 1000 string objects in memory
        String s = "";
        for (int i = 0; i < 5; i++) s += i;

        // Efficient: mutates single internal char array
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 5; i++) sb.append(i);

        System.out.println(sb.toString()); // "01234"
    }
}`,
      ask: "Most asked · TCS · Infosys · Amazon · Oracle"
    },
    {
      id: 6,
      level: "beginner",
      q: "final vs finally vs finalize() in Java?",
      a: "What this is\n• `final`: Keyword to restrict modification (final variable = constant, final method = cannot override, final class = cannot inherit).\n• `finally`: Block in exception handling that executes regardless of whether an exception was thrown or caught (used for resource cleanup).\n• `finalize()`: Method in `Object` called by Garbage Collector before destroying an object (deprecated since Java 9).",
      code: `public class FinalDemo {
    final int MAX_USERS = 100; // Constant

    public static void main(String[] args) {
        try {
            int result = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Caught exception: " + e.getMessage());
        } finally {
            System.out.println("Finally block ALWAYS executes for cleanup!");
        }
    }
}`,
      ask: "Most asked · Amazon · Microsoft · TCS · Cognizant"
    },
    {
      id: 7,
      level: "beginner",
      q: "What is static keyword in Java (variables, methods, blocks)?",
      a: "What this is\nThe `static` keyword means the member belongs to the class itself rather than individual instances (objects):\n• `static variable`: Single shared copy in memory for all objects of that class.\n• `static method`: Can be called without creating an instance (`Math.max()`). Cannot access non-static instance variables or `this`.\n• `static block`: Executes exactly once when the class is first loaded into JVM memory.",
      code: `public class StaticDemo {
    static int count = 0; // Shared across all instances
    int id;               // Unique per instance

    static {
        System.out.println("Static block: Class loaded into memory!");
    }

    public StaticDemo(int id) {
        this.id = id;
        count++;
    }

    public static void showCount() {
        System.out.println("Total instances created: " + count);
    }

    public static void main(String[] args) {
        new StaticDemo(1);
        new StaticDemo(2);
        StaticDemo.showCount(); // 2
    }
}`,
      ask: "Most asked · Oracle · TCS · Microsoft · Amazon"
    },
    {
      id: 8,
      level: "intermediate",
      q: "Interface vs Abstract Class in Java (Java 8+)?",
      a: "What this is\n• Abstract Class: Can have state (instance variables), constructors, and both abstract and concrete methods. A class can extend only ONE abstract class (single inheritance).\n• Interface: A contract. Can have `default` and `static` methods (Java 8+) and `private` helper methods (Java 9+). A class can implement MULTIPLE interfaces (multiple inheritance of type).\n\nRule of thumb: Use interface for capabilities (\"can-do\", e.g. `Comparable`, `Runnable`) and abstract class for core identity (\"is-a\").",
      code: `interface Flyable {
    void fly(); // Abstract
    default void glide() { // Java 8 default method
        System.out.println("Gliding through the air");
    }
}

abstract class Animal {
    String name;
    Animal(String name) { this.name = name; }
    abstract void sound();
}

class Bird extends Animal implements Flyable {
    Bird(String name) { super(name); }
    public void sound() { System.out.println("Chirp"); }
    public void fly() { System.out.println(name + " is flying!"); }
}

public class InterfaceDemo {
    public static void main(String[] args) {
        Bird b = new Bird("Eagle");
        b.sound();
        b.fly();
        b.glide();
    }
}`,
      ask: "Most asked · Amazon · Google · Microsoft · Meta"
    },
    {
      id: 9,
      level: "intermediate",
      q: "Checked vs Unchecked Exceptions in Java?",
      a: "What this is\n• Checked Exceptions: Subclasses of `Exception` (excluding `RuntimeException`). Checked at compile time. Method MUST declare them with `throws` or handle with `try-catch` (e.g. `IOException`, `SQLException`).\n• Unchecked Exceptions: Subclasses of `RuntimeException` and `Error`. Occur at runtime due to programming bugs (e.g. `NullPointerException`, `ArrayIndexOutOfBoundsException`). Compiler does not force handling.",
      code: `import java.io.*;

public class ExceptionDemo {
    // Checked exception: MUST be declared with throws
    public static void readFile(String path) throws IOException {
        FileReader fr = new FileReader(path);
    }

    public static void main(String[] args) {
        try {
            readFile("missing.txt");
        } catch (IOException e) {
            System.out.println("Handled checked exception: " + e.getMessage());
        }

        // Unchecked exception (RuntimeException)
        String s = null;
        // s.length(); // Throws NullPointerException at runtime
    }
}`,
      ask: "Most asked · Oracle · Amazon · TCS · Microsoft"
    },
    {
      id: 10,
      level: "intermediate",
      q: "How does HashMap work internally in Java?",
      a: "What this is\nJava's `HashMap` is built on an array of Node buckets (Hash Table):\n1. `hashCode()`: Calculates bucket index using `(n - 1) & hash(key)`.\n2. Collision Handling: Linked list chaining at the bucket.\n3. Java 8 Optimization: When bucket length exceeds 8 (and table size >= 64), the linked list converts to a self-balancing Red-Black Tree (`TreeNode`), improving worst-case search from O(N) to O(log N).\n4. Resizing: When size exceeds `capacity * loadFactor` (default 0.75), array doubles in size.",
      code: `import java.util.HashMap;

public class HashMapDemo {
    public static void main(String[] args) {
        HashMap<String, Integer> map = new HashMap<>();
        map.put("Alice", 95); // computes hashCode("Alice") -> bucket index
        map.put("Bob", 88);

        System.out.println(map.get("Alice")); // O(1) average lookup: 95
    }
}`,
      ask: "Most asked · Amazon · Microsoft · Google · Uber · Adobe"
    },
    {
      id: 11,
      level: "intermediate",
      q: "Why must equals() and hashCode() be overridden together in Java?",
      a: "What this is\nThe `equals` and `hashCode` contract dictates:\n• If `a.equals(b) == true`, then `a.hashCode() == b.hashCode()` MUST also be true.\n• If you override `equals()` without overriding `hashCode()`, two equal objects will generate different bucket hashcodes, causing `HashMap` and `HashSet` lookups to fail to find existing keys.",
      code: `import java.util.*;

class Student {
    int id;
    String name;
    Student(int id, String name) { this.id = id; this.name = name; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Student)) return false;
        Student s = (Student) o;
        return id == s.id && Objects.equals(name, s.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name); // Mandatory to match equals
    }
}

public class HashCodeDemo {
    public static void main(String[] args) {
        HashSet<Student> set = new HashSet<>();
        set.add(new Student(1, "Ada"));
        System.out.println(set.contains(new Student(1, "Ada"))); // true!
    }
}`,
      ask: "Most asked · Amazon · Google · Goldman Sachs · Morgan Stanley"
    },
    {
      id: 12,
      level: "beginner",
      q: "What is Autoboxing and Unboxing in Java?",
      a: "What this is\n• Autoboxing: Automatic conversion of primitive types into their corresponding wrapper classes (`int` -> `Integer`, `double` -> `Double`) by the compiler.\n• Unboxing: Automatic conversion of wrapper objects back into primitive types.\n• Integer Cache: Java caches `Integer` objects for values between `-128` and `127`. For cached values, `==` returns true.",
      code: `public class BoxingDemo {
    public static void main(String[] args) {
        // Autoboxing: primitive int to Integer object
        Integer obj = 100; // Integer.valueOf(100)

        // Unboxing: Integer object to primitive int
        int num = obj;     // obj.intValue()

        // Integer Cache (-128 to 127)
        Integer a = 120, b = 120;
        Integer c = 200, d = 200;
        System.out.println(a == b); // true (cached object reference)
        System.out.println(c == d); // false (distinct heap objects, use .equals!)
    }
}`,
      ask: "Most asked · Amazon · Oracle · TCS"
    },
    {
      id: 13,
      level: "intermediate",
      q: "What is the volatile keyword in Java?",
      a: "What this is\nThe `volatile` keyword guarantees Memory Visibility across threads in multithreading:\n• Without `volatile`, threads may cache variable values in CPU registers/L1 cache, missing updates made by other threads.\n• With `volatile`, all reads and writes go directly to Main Memory (RAM), ensuring immediate visibility.\n• Note: `volatile` guarantees visibility, but does NOT guarantee atomicity (e.g. `count++` still needs `AtomicInteger` or `synchronized`).",
      code: `public class VolatileDemo {
    // Guarantees all threads see status changes immediately in RAM
    private static volatile boolean running = true;

    public static void main(String[] args) throws InterruptedException {
        Thread worker = new Thread(() -> {
            while (running) {
                // busy work
            }
            System.out.println("Worker thread safely stopped!");
        });

        worker.start();
        Thread.sleep(100);
        running = false; // Immediately visible to worker thread
        worker.join();
    }
}`,
      ask: "Most asked · Google · Amazon · Microsoft · Oracle"
    },
    {
      id: 14,
      level: "advanced",
      q: "What is the Java Memory Model and Happens-Before relationship?",
      a: "What this is\nThe Java Memory Model (JMM) defines how threads interact through memory and when actions by one thread are guaranteed to be visible to another.\n\nKey Happens-Before Rules:\n1. Program Order: Each action in a thread happens-before any later action in the same thread.\n2. Monitor Lock: An unlock on a monitor lock happens-before every subsequent lock on the same monitor.\n3. Volatile Variable: A write to a `volatile` field happens-before every subsequent read of that field.\n4. Thread Start: A call to `Thread.start()` happens-before any action in the started thread.",
      code: `// Synchronized block establishes happens-before guarantee
class SharedResource {
    private int data = 0;
    
    public synchronized void write(int val) {
        data = val; // Write happens-before subsequent read
    }

    public synchronized int read() {
        return data;
    }
}`,
      ask: "Most asked · Google · Goldman Sachs · Meta"
    },
    {
      id: 15,
      level: "intermediate",
      q: "What is the difference between Comparable and Comparator in Java?",
      a: "What this is\n• `Comparable` interface (`compareTo` method): Defines Natural Ordering for a class. Implemented inside the class itself (`class Student implements Comparable<Student>`).\n• `Comparator` interface (`compare` method): Defines Custom/Multiple Sorting strategies. Implemented as external lambda or separate classes (`Comparator.comparing(Student::getName)`).",
      code: `import java.util.*;

class Employee implements Comparable<Employee> {
    int id;
    String name;
    Employee(int id, String name) { this.id = id; this.name = name; }

    // Natural ordering by ID
    public int compareTo(Employee o) {
        return Integer.compare(this.id, o.id);
    }
}

public class SortDemo {
    public static void main(String[] args) {
        List<Employee> list = Arrays.asList(new Employee(3, "Charlie"), new Employee(1, "Alice"));

        Collections.sort(list); // Uses Comparable (Natural Order by ID)
        
        // Custom sort by Name using Comparator & Method Reference (::)
        list.sort(Comparator.comparing(e -> e.name));
    }
}`,
      ask: "Most asked · Amazon · TCS · Microsoft"
    },
    {
      id: 16,
      level: "intermediate",
      q: "What are Java Generics and Type Erasure?",
      a: "What this is\n• Java Generics (`List<T>`, `<K, V>`): Enable type-safe collections and algorithms with compile-time type checking, eliminating manual type casts.\n• Type Erasure: To maintain backward compatibility with older Java versions, the compiler removes (erases) generic type information during compilation and replaces it with `Object` (or bounding types) with inserted casts.",
      code: `import java.util.ArrayList;

public class GenericsDemo {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("Hello");
        // list.add(123); // Compile-time error: Type Safety!
        
        String s = list.get(0); // No manual cast needed
        System.out.println(s);
    }
}`,
      ask: "Most asked · Oracle · Microsoft · Amazon"
    },
    {
      id: 17,
      level: "intermediate",
      q: "What is Garbage Collection in Java and how does it work?",
      a: "What this is\nJava Garbage Collection (GC) automatically reclaims memory occupied by unreachable objects on the heap:\n1. Generational Hypothesis: Most created objects die young.\n2. Memory Generations:\n   • Young Generation: Eden Space + 2 Survivor Spaces (S0, S1). Fast Minor GC occurs here.\n   • Old/Tenured Generation: Long-lived objects promoted from Survivor space. Major GC / Full GC occurs here.\n3. Common Collectors: G1 GC (Garbage-First, default), ZGC (low latency), Parallel GC.",
      code: `public class GCDemo {
    public static void main(String[] args) {
        String temporary = new String("Will be garbage collected");
        temporary = null; // Object is now eligible for GC (unreachable from GC Roots)

        System.gc(); // Suggests JVM to run GC (no guarantee of immediate run)
    }
}`,
      ask: "Most asked · Amazon · Google · Microsoft · Adobe"
    },
    {
      id: 18,
      level: "intermediate",
      q: "What is try-with-resources in Java?",
      a: "What this is\nIntroduced in Java 7, `try-with-resources` automatically closes any resource implementing `AutoCloseable` (e.g. `BufferedReader`, `Connection`, `InputStream`) at the end of the statement, eliminating messy manual `finally` close blocks.",
      code: `import java.io.*;

public class TryWithResourcesDemo {
    public static void main(String[] args) {
        // Automatically closed when exiting try block
        try (BufferedReader br = new BufferedReader(new StringReader("Hello Java"))) {
            System.out.println(br.readLine());
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`,
      ask: "Most asked · Amazon · Oracle · TCS"
    },
    {
      id: 19,
      level: "intermediate",
      q: "What is ConcurrentHashMap vs Collections.synchronizedMap()?",
      a: "What this is\n• `Collections.synchronizedMap()`: Locks the ENTIRE map for every read and write operation, causing high thread contention and poor scalability.\n• `ConcurrentHashMap`: Highly concurrent. In Java 8+, uses fine-grained bucket-level locking (`synchronized` on individual bucket head nodes) and lock-free reads (`volatile`/CAS), allowing concurrent reads and writes across different buckets without blocking.",
      code: `import java.util.concurrent.ConcurrentHashMap;

public class ConcurrentMapDemo {
    public static void main(String[] args) {
        ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();
        map.put("activeUsers", 1000);
        map.compute("activeUsers", (k, v) -> v + 1); // Atomic thread-safe update
        System.out.println("Users: " + map.get("activeUsers"));
    }
}`,
      ask: "Most asked · Google · Amazon · Goldman Sachs · Meta"
    },
    {
      id: 20,
      level: "intermediate",
      q: "What are Functional Interfaces and @FunctionalInterface in Java?",
      a: "What this is\nA Functional Interface has exactly ONE abstract method. It can be implemented using lambda expressions or method references (`::`).\n\nCommon Built-in Interfaces (`java.util.function`):\n• `Predicate<T>`: `boolean test(T t)`\n• `Function<T, R>`: `R apply(T t)`\n• `Consumer<T>`: `void accept(T t)`\n• `Supplier<T>`: `T get()`",
      code: `import java.util.function.*;

public class FunctionalDemo {
    public static void main(String[] args) {
        Predicate<Integer> isEven = n -> n % 2 == 0;
        Function<String, Integer> stringLength = String::length; // Method reference

        System.out.println("Is 4 even? " + isEven.test(4)); // true
        System.out.println("Length: " + stringLength.apply("Preplace")); // 8
    }
}`,
      ask: "Most asked · Amazon · Microsoft · Oracle · TCS"
    },
    {
      id: 21,
      level: "intermediate",
      q: "What is the Java Stream API and how does lazy evaluation work?",
      a: "What this is\nThe Java Stream API (`java.util.stream`) processes sequences of elements declaratively:\n1. Intermediate Operations (`filter`, `map`, `sorted`): Transform stream into another stream. Evaluated lazily (not executed until a terminal operation is called).\n2. Terminal Operations (`collect`, `forEach`, `reduce`, `count`): Trigger the execution pipeline and produce a final result or side-effect.",
      code: `import java.util.*;
import java.util.stream.*;

public class StreamDemo {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8);

        List<Integer> evenSquares = nums.stream()
            .filter(n -> n % 2 == 0) // Intermediate (lazy)
            .map(n -> n * n)         // Intermediate (lazy)
            .collect(Collectors.toList()); // Terminal (triggers processing)

        System.out.println(evenSquares); // [4, 16, 36, 64]
    }
}`,
      ask: "Most asked · Amazon · Google · Microsoft · Adobe"
    }
  ]
};
