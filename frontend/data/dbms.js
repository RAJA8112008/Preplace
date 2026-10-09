window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA["dbms"] = {
  "kind": "topic",
  "notes": [
    {
      "title": "DBMS vs File System & 3-Tier Architecture",
      "flow": [
        "External View (User Views)",
        "Conceptual Level (Logical Tables, Keys, Constraints)",
        "Internal Level (Physical Storage, B+ Trees, Disk Blocks)"
      ],
      "body": "The problem before\nEarly applications stored records in flat files (.txt, .csv). If two programs wrote to the same file simultaneously, records got corrupted. Adding a new column required rewriting all reading software (tight data dependency), and searching required scanning every byte on disk.\n\nWhat this is\nA Database Management System (DBMS) is software that manages structured data with schema validation, concurrency control, crash recovery, and query optimization.\n\nANSI-SPARC 3-Schema Architecture:\n1. External Level (View Level): Describes the part of the database relevant to specific users/roles.\n2. Conceptual Level (Logical Level): Describes what data is stored, table relationships, entities, types, and constraints. Provides Logical Data Independence.\n3. Internal Level (Physical Level): Describes how data is physically stored on disk (indexes, file organization, block sizes). Provides Physical Data Independence.\n\nWhat it solves\nData Independence (changes in physical disk storage or logical schema do not break existing application queries), Eliminates Data Redundancy, Enforces Integrity Constraints.\n\nReal-life example\nA bank system. You only see your checking balance (External View). The bank database tracks all customer tables, ledgers, and foreign keys (Conceptual Schema). The hard drives in the secure data center organize raw bytes into B+ Tree disk blocks (Physical Internal Schema).\n\nUses\nPostgreSQL, MySQL, Oracle, SQL Server, SQLite.\n\nWatch out\nPhysical Data Independence: Modifying internal storage (e.g. creating a B+ Tree index) does NOT require changing conceptual tables or user queries."
    },
    {
      "title": "Database Keys: Super, Candidate, Primary & Foreign",
      "flow": [
        "Super Key (Any set uniquely identifying a row)",
        "Candidate Key (Minimal Super Key)",
        "Primary Key (Chosen Candidate Key, NOT NULL)",
        "Alternate Key (Remaining Candidate Keys)",
        "Foreign Key (References Primary Key in another table)"
      ],
      "body": "The problem before\nWithout strict keys, duplicate rows got inserted, and orders pointed to deleted or non-existent customers (Orphan Records).\n\nWhat this is\nKeys are attributes that uniquely identify a tuple (row) in a relation (table) and establish referential integrity between tables.\n\nKey Hierarchy & Definitions:\n1. Super Key (SK): Any set of one or more attributes that uniquely identifies a row in a table. (e.g., `{RollNo}`, `{RollNo, Name}`, `{Aadhaar, Email}`).\n2. Candidate Key (CK): A MINIMAL Super Key (a super key from which no attribute can be removed without losing uniqueness).\n3. Primary Key (PK): The candidate key chosen by the database designer as the principal unique identifier. Must be unique and can NEVER be NULL.\n4. Alternate Key (AK) / Secondary Key: Candidate keys that were not chosen as the Primary Key.\n5. Foreign Key (FK): An attribute in one table that references the Primary Key (or Unique Key) of another table, enforcing Referential Integrity.\n6. Composite Key: A key composed of two or more attributes together.\n\nWhat it solves\nPrevents duplicate records, ensures fast indexed lookups, and stops invalid data creation (e.g. placing an order for a customer ID that does not exist).\n\nReal-life example\nA Citizen registry. Super Key: `{Passport, Name, Phone}`. Candidate Keys: `{Passport}` and `{NationalID}`. Primary Key: `{NationalID}`. Alternate Key: `{Passport}`.\n\nUses\nEntity-Relationship (ER) modeling, table creation, join queries.\n\nWatch out\nAll Candidate Keys are Super Keys, but NOT all Super Keys are Candidate Keys (because Super Keys may contain unnecessary extra attributes)."
    },
    {
      "title": "Normalization: 1NF, 2NF, 3NF & BCNF",
      "flow": [
        "Unnormalized (Multi-valued attributes)",
        "1NF (Atomic Values, No Repeating Groups)",
        "2NF (1NF + No Partial Dependency)",
        "3NF (2NF + No Transitive Dependency)",
        "BCNF (For every X -> Y, X must be a Super Key)"
      ],
      "body": "The problem before\nUnnormalized tables store repeated values, causing three database anomalies:\n- Insertion Anomaly: Cannot insert a department until a student joins it.\n- Deletion Anomaly: Deleting the last student in a course accidentally deletes the course description too.\n- Update Anomaly: Changing a department head requires updating 500 rows; missing one causes data inconsistency.\n\nWhat this is\nNormalization is the systematic process of organizing relational tables to minimize data redundancy and prevent anomalies without losing information (Lossless Join).\n\nNormal Forms in Order:\n1. First Normal Form (1NF):\n   - Every column must contain only atomic (indivisible) single values (no arrays or comma-separated lists).\n   - Unique column names; order of rows/columns does not matter.\n\n2. Second Normal Form (2NF):\n   - Must be in 1NF.\n   - No Partial Dependency: No non-prime attribute should be functionally dependent on a subset of any candidate key. (Applies only when the candidate key is composite).\n\n3. Third Normal Form (3NF):\n   - Must be in 2NF.\n   - No Transitive Dependency: For every functional dependency `X -> Y`, either `X` is a Super Key or `Y` is a Prime Attribute.\n\n4. Boyce-Codd Normal Form (BCNF / 3.5NF):\n   - Stricter version of 3NF.\n   - For EVERY non-trivial functional dependency `X -> Y`, `X` MUST be a Super Key.\n\nWhat it solves\nEliminates data duplication, saves disk space, and keeps data consistent upon every INSERT, UPDATE, and DELETE.\n\nReal-life example\nStoring student name, marks, hostel building, and warden phone in one table. If the hostel warden changes phone number, you don't want to update 1,000 student records.\n\nUses\nRelational schema design, OLTP production databases.\n\nWatch out\nOver-normalization can cause excessive JOIN operations in read-heavy applications, which is why OLAP analytics databases often deliberately de-normalize."
    },
    {
      "title": "ACID Properties & Transaction States",
      "flow": [
        "Active State",
        "Partially Committed",
        "Committed (Permanent on Disk)",
        "Failed -> Aborted -> Rolled Back"
      ],
      "body": "The problem before\nA bank transfers ₹5,000 from Account A to Account B. The system debits Account A, and then the power fails before crediting Account B. Without transaction safety, ₹5,000 vanishes into thin air.\n\nWhat this is\nA Transaction is a logical unit of database processing consisting of one or more read/write operations.\n\nACID Properties:\n1. Atomicity: 'All or Nothing'. Either all operations of the transaction complete successfully (COMMIT), or the database is rolled back to its original state (ROLLBACK).\n2. Consistency: The database must transition from one valid state to another, satisfying all integrity constraints (e.g. balance >= 0, foreign keys).\n3. Isolation: Concurrent execution of transactions yields the same state as if they had executed serially. Intermediate states are invisible to other transactions.\n4. Durability: Once a transaction commits, its changes are permanently recorded in non-volatile storage (WAL / Write-Ahead Log) and will survive any system crash.\n\nTransaction States:\nActive -> Partially Committed -> Committed.\nActive / Partially Committed -> Failed -> Aborted (Rollback).\n\nWhat it solves\nData safety during crashes and concurrent multi-user execution.\n\nReal-life example\nATM cash withdrawal. The machine debits your bank balance, dispenses cash, and prints receipt as a single atomic unit.\n\nUses\nPostgreSQL, MySQL InnoDB, Oracle, banking and e-commerce systems.\n\nWatch out\nWrite-Ahead Logging (WAL): A database always writes the transaction log to disk BEFORE writing modified data pages to disk."
    },
    {
      "title": "Concurrency Control, Serializability & 2PL",
      "flow": [
        "Growing Phase (Locks Acquired, None Released)",
        "Lock Point (All Locks Held)",
        "Shrinking Phase (Locks Released, None Acquired)"
      ],
      "body": "The problem before\nWhen multiple transactions run concurrently, three classic concurrency anomalies occur:\n1. Dirty Read (Write-Read Conflict): Transaction T1 writes data, T2 reads it, then T1 aborts and rolls back.\n2. Non-Repeatable Read (Read-Write Conflict): T1 reads a row, T2 updates/deletes that row and commits; T1 reads again and sees a different value.\n3. Phantom Read: T1 queries a range of rows (`WHERE age > 20`), T2 inserts a new row in that range and commits; T1 repeats query and sees a 'phantom' row.\n\nSerializability:\nA concurrent schedule is Conflict Serializable if it can be transformed into a serial schedule by swapping non-conflicting adjacent operations. Tested using a Precedence Graph (Serialization Graph) — if the graph has NO cycles, the schedule is conflict serializable.\n\nTwo-Phase Locking (2PL):\nGuarantees conflict serializability. Divides a transaction into two distinct phases:\n1. Growing Phase: Transaction may acquire locks (Shared/Exclusive), but cannot release any lock.\n2. Shrinking Phase: Transaction may release locks, but cannot acquire any new lock.\n\nVariants of 2PL:\n- Strict 2PL: All Exclusive (X) locks held until COMMIT/ABORT (prevents cascading aborts).\n- Rigorous 2PL: All Shared (S) AND Exclusive (X) locks held until COMMIT/ABORT.\n\nWhat it solves\nGuarantees transaction isolation and mathematical correctness during high-throughput concurrent access.\n\nReal-life example\nA real estate closing. Both buyer and seller lock down contracts during negotiations and sign together at the closing table before keys are handed over.\n\nUses\nDatabase isolation levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable).\n\nWatch out\nStandard 2PL does NOT prevent deadlocks. Strict 2PL prevents cascading aborts."
    }
  ],
  "examples": [
    {
      "title": "SQL Transactions with Savepoints",
      "lang": "sql",
      "desc": "How to execute atomic multi-table updates and rollback safely.",
      "code": "BEGIN TRANSACTION;\n\n-- Step 1: Deduct money from sender\nUPDATE Accounts \nSET balance = balance - 1000 \nWHERE id = 1;\n\n-- Create a checkpoint\nSAVEPOINT before_reward;\n\n-- Step 2: Credit receiver\nUPDATE Accounts \nSET balance = balance + 1000 \nWHERE id = 2;\n\n-- If reward credit fails, rollback only the reward\n-- ROLLBACK TO before_reward;\n\n-- Finalize everything\nCOMMIT;"
    },
    {
      "title": "Normalizing to 3NF in SQL",
      "lang": "sql",
      "desc": "Splitting unnormalized orders into clean 3NF parent and child tables.",
      "code": "-- Step 1: Parent Table (Customers)\nCREATE TABLE Customers (\n    customer_id SERIAL PRIMARY KEY,\n    name VARCHAR(100) NOT NULL,\n    email VARCHAR(100) UNIQUE NOT NULL\n);\n\n-- Step 2: Child Table (Orders with Foreign Key)\nCREATE TABLE Orders (\n    order_id SERIAL PRIMARY KEY,\n    customer_id INT NOT NULL REFERENCES Customers(customer_id) ON DELETE CASCADE,\n    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),\n    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);"
    }
  ],
  "questions": [
    {
      "id": 1,
      "level": "intermediate",
      "q": "What is Database Normalization? Explain 1NF, 2NF, 3NF, and BCNF with concrete examples.",
      "a": "Summary\nQuestion: Database Normalization (1NF to BCNF)\n\nPlain answer:\nNormalization is the process of organizing database schema to eliminate anomalies (Insertion, Deletion, Update) and minimize data redundancy.\n\n1. 1NF (First Normal Form):\n   - Rule: All attributes must be atomic. No multi-valued attributes or nested tables.\n   - Violation: `Student(ID, Name, Subjects: [Math, Physics, CS])`\n   - Fix: Split into individual rows: `(1, Ada, Math)`, `(1, Ada, Physics)`, `(1, Ada, CS)`.\n\n2. 2NF (Second Normal Form):\n   - Rule: Must be in 1NF + No Partial Dependency (no non-prime attribute should depend on a proper subset of a composite candidate key).\n   - Violation: `Enrollment(StudentID, CourseID, CourseName, Grade)`. Primary Key = `{StudentID, CourseID}`. Here `CourseName` depends only on `CourseID` (partial key).\n   - Fix: Decompose into `Enrollment(StudentID, CourseID, Grade)` and `Course(CourseID, CourseName)`.\n\n3. 3NF (Third Normal Form):\n   - Rule: Must be in 2NF + No Transitive Dependency (non-prime attribute depending on another non-prime attribute).\n   - For every functional dependency `X -> Y`, either `X` is a Super Key or `Y` is a Prime Attribute.\n   - Violation: `Employee(EmpID, Name, DeptID, DeptName)`. `EmpID -> DeptID` and `DeptID -> DeptName`.\n   - Fix: Decompose into `Employee(EmpID, Name, DeptID)` and `Department(DeptID, DeptName)`.\n\n4. BCNF (Boyce-Codd Normal Form):\n   - Rule: Stricter than 3NF. For every non-trivial functional dependency `X -> Y`, `X` MUST be a Super Key.\n   - Used when there are multiple overlapping candidate keys.\n\nCompanies that ask this: Amazon, Microsoft, Oracle, Google, TCS, Infosys.",
      "code": "-- Example of 3NF Normalized Schema in SQL:\nCREATE TABLE Department (\n    dept_id INT PRIMARY KEY,\n    dept_name VARCHAR(50) NOT NULL\n);\n\nCREATE TABLE Employee (\n    emp_id INT PRIMARY KEY,\n    name VARCHAR(50) NOT NULL,\n    dept_id INT,\n    FOREIGN KEY (dept_id) REFERENCES Department(dept_id)\n);"
    },
    {
      "id": 2,
      "level": "beginner",
      "q": "What is the difference between Super Key, Candidate Key, Primary Key, and Foreign Key?",
      "a": "Summary\nQuestion: Types of Database Keys\n\nPlain answer:\n\n1. Super Key (SK):\n   - Any set of attributes that uniquely identifies a row in a table. It may contain redundant columns.\n   - Example: For Employee table, `{EmpID}`, `{EmpID, Name}`, `{EmpID, Email, Phone}` are all Super Keys.\n\n2. Candidate Key (CK):\n   - A minimal Super Key with no unnecessary attributes. Removing any column from a Candidate Key loses its uniqueness.\n   - Example: `{EmpID}` and `{Email}` are Candidate Keys.\n\n3. Primary Key (PK):\n   - A chosen Candidate Key selected by the database designer to uniquely identify tuples.\n   - Must be unique and CANNOT contain NULL values. There can only be ONE primary key per table.\n\n4. Alternate Key (AK):\n   - Candidate keys that were not chosen as the primary key. Example: If `EmpID` is PK, then `Email` is an Alternate Key.\n\n5. Foreign Key (FK):\n   - A column (or set of columns) in a child table that references the Primary Key (or Unique Key) of a parent table, ensuring Referential Integrity.\n\nCompanies that ask this: Microsoft, Amazon, TCS, Cognizant, Wipro, Accenture.",
      "code": "// Key Relationship Formula:\n// All Candidate Keys ⊂ Super Keys\n// Primary Key = Chosen Candidate Key (NOT NULL)\n// Alternate Keys = Candidate Keys - Primary Key"
    },
    {
      "id": 3,
      "level": "intermediate",
      "q": "What are ACID properties in DBMS, and why are they critical?",
      "a": "Summary\nQuestion: ACID Properties in DBMS\n\nPlain answer:\nACID represents four fundamental properties guaranteed by database transactions:\n\n1. Atomicity (All or Nothing):\n   - Either all operations in a transaction execute successfully to completion, or the entire transaction is aborted and rolled back with zero partial changes.\n   - Managed by: Recovery Management Component (using Write-Ahead Logs / Undo logs).\n\n2. Consistency (Preserving Invariants):\n   - The database must remain in a valid state satisfying all schemas, foreign keys, and CHECK constraints before and after the transaction.\n   - Managed by: Application logic and DBMS constraint checkers.\n\n3. Isolation (Independent Execution):\n   - Intermediate states of a transaction are completely invisible to other concurrent transactions.\n   - Managed by: Concurrency Control Manager (using Locking, 2PL, MVCC, Timestamping).\n\n4. Durability (Survivability of Committed Data):\n   - Once a transaction is committed, its updates are permanent and will not be lost even in the event of an immediate power outage or system crash.\n   - Managed by: Recovery Manager using Write-Ahead Logging (WAL) and Redo logs.\n\nCompanies that ask this: Amazon, Google, Flipkart, Morgan Stanley, Goldman Sachs.",
      "code": "-- SQL Transaction with ACID guarantees:\nBEGIN TRANSACTION;\n  UPDATE Accounts SET balance = balance - 500 WHERE id = 1; -- Debit\n  UPDATE Accounts SET balance = balance + 500 WHERE id = 2; -- Credit\nCOMMIT; -- Permanently recorded"
    },
    {
      "id": 4,
      "level": "intermediate",
      "q": "What is the difference between Clustered Index and Non-Clustered (Secondary) Index?",
      "a": "Summary\nQuestion: Clustered vs Non-Clustered Index\n\nPlain answer:\n\n1. Clustered Index:\n   - Defines the physical order in which actual data rows are stored on disk blocks.\n   - There can be ONLY ONE Clustered Index per table (usually automatically created on the Primary Key).\n   - Leaf nodes of the B+ Tree contain the actual physical table data rows.\n   - Extremely fast for range queries (`BETWEEN 10 AND 50`) and sorted ORDER BY queries.\n\n2. Non-Clustered (Secondary) Index:\n   - Stored in a separate structure from the actual table rows.\n   - A table can have MULTIPLE Non-Clustered Indexes (e.g. on `email`, `created_at`).\n   - Leaf nodes of the B+ Tree contain a pointer (RowID or Primary Key value) to the actual data row.\n   - Requires an extra lookup step (Bookmark Lookup / Index Lookup) to fetch non-indexed columns.\n\nReal-life Analogy:\nA Clustered Index is like a physical dictionary (words are physically sorted from A to Z). A Non-Clustered Index is the index at the back of a textbook (lists topics with page number references pointing back to the book).\n\nCompanies that ask this: Microsoft, Oracle, Amazon, Uber, Atlassian.",
      "code": "-- Creating both types of indexes in SQL:\n-- Clustered index (created automatically with Primary Key):\nALTER TABLE Users ADD CONSTRAINT PK_Users PRIMARY KEY (id);\n\n-- Non-clustered secondary index:\nCREATE INDEX idx_users_email ON Users(email);"
    },
    {
      "id": 5,
      "level": "intermediate",
      "q": "What is Conflict Serializability and how do you test it using a Precedence Graph?",
      "a": "Summary\nQuestion: Conflict Serializability & Precedence Graph\n\nPlain answer:\nA schedule is Conflict Serializable if it can be transformed into a serial schedule by repeatedly swapping non-conflicting adjacent operations.\n\nWhen do two operations conflict?\nTwo operations conflict if and only if:\n1. They belong to different transactions (`T1` and `T2`).\n2. They operate on the exact SAME data item (`X`).\n3. At least one of the two operations is a WRITE (`W(X)`).\n(i.e., Read-Write, Write-Read, or Write-Write conflict).\n\nHow to construct a Precedence Graph (Serialization Graph):\n1. Create a vertex (node) for each transaction `Ti` in the schedule.\n2. Draw a directed edge from `Ti -> Tj` if an operation of `Ti` conflicts with an operation of `Tj` and occurs BEFORE it in time.\n3. Cycle Detection: If the precedence graph contains ANY cycle, the schedule is NOT conflict serializable. If the graph is a DAG (no cycles), the schedule IS conflict serializable, and the topological sort gives the equivalent serial schedule.\n\nCompanies that ask this: Google, Microsoft, Adobe, Oracle, TCS, Infosys.",
      "code": "// Conflict Check Matrix:\n// Operation 1 | Operation 2 | Conflict?\n// Read(X)     | Read(X)     | No (Both reads)\n// Read(X)     | Write(X)    | YES (Read-Write)\n// Write(X)    | Read(X)     | YES (Write-Read)\n// Write(X)    | Write(X)    | YES (Write-Write)"
    },
    {
      "id": 6,
      "level": "intermediate",
      "q": "What is Two-Phase Locking (2PL) and how does it prevent concurrency anomalies?",
      "a": "Summary\nQuestion: Two-Phase Locking (2PL) Protocol\n\nPlain answer:\n2PL is a concurrency control protocol that guarantees conflict serializability by enforcing a strict locking rule in two phases:\n\n1. Growing Phase (Phase 1):\n   - A transaction may acquire locks (Shared lock `S` for reading, Exclusive lock `X` for writing).\n   - A transaction CANNOT release any locks during this phase.\n\n2. Shrinking Phase (Phase 2):\n   - A transaction may release locks.\n   - A transaction CANNOT acquire any new locks once it releases its first lock.\n\nThe Lock Point is the exact point in time when a transaction acquires its final lock.\n\nTypes of 2PL:\n- Basic 2PL: Ensures serializability, but can suffer from Cascading Aborts and Deadlocks.\n- Strict 2PL: All Exclusive (X) locks must be held until the transaction commits or aborts. (Prevents dirty reads and cascading rollbacks).\n- Rigorous 2PL: All Shared (S) AND Exclusive (X) locks are held until commit/abort.\n\nCompanies that ask this: Microsoft, Oracle, Amazon, Bloomberg.",
      "code": "// Strict 2PL Workflow:\n// 1. Lock S(A), Lock X(B)\n// 2. Read(A), Write(B)\n// 3. COMMIT Transaction\n// 4. Release all locks simultaneously"
    },
    {
      "id": 7,
      "level": "beginner",
      "q": "What are Relational Algebra Fundamental Operations and their SQL equivalents?",
      "a": "Summary\nQuestion: Relational Algebra Operations\n\nPlain answer:\nRelational Algebra is a procedural query language that takes relations as input and produces relations as output.\n\nFundamental Operators:\n1. Selection (σ): Filters rows satisfying a predicate. (SQL: `WHERE` clause)\n2. Projection (π): Selects specific columns/attributes. (SQL: `SELECT col1, col2`)\n3. Union (∪): Combines tuples from two union-compatible tables. (SQL: `UNION`)\n4. Set Difference (-): Tuples in relation A but not in B. (SQL: `EXCEPT` / `MINUS`)\n5. Cartesian Product (×): Combines every row of A with every row of B. (SQL: `CROSS JOIN`)\n6. Rename (ρ): Renames relation or attributes. (SQL: `AS` alias)\n\nDerived Operators:\n- Natural Join (⨝): Cartesian product followed by selection on common attributes and projection. (SQL: `INNER JOIN ... ON`)\n- Intersection (∩): Tuples in both A and B. (SQL: `INTERSECT`)\n\nCompanies that ask this: Microsoft, Google, TCS, Infosys, GATE CS.",
      "code": "-- Relational Algebra: π name, salary (σ dept='IT' (Employee))\n-- SQL Equivalent:\nSELECT name, salary \nFROM Employee \nWHERE dept = 'IT';"
    },
    {
      "id": 8,
      "level": "beginner",
      "q": "What is the difference between a Stored Procedure, a Function, and a View?",
      "a": "Summary\nQuestion: Views vs Stored Procedures vs Functions\n\nPlain answer:\n\n1. View:\n   - A virtual table based on the result-set of an SQL query. Does NOT store data physically on disk (unless it is a Materialized View).\n   - Use: Simplifies complex queries and restricts column visibility for security.\n\n2. Stored Procedure:\n   - Precompiled collection of SQL statements and control logic (IF/ELSE, loops) stored in the database.\n   - Can perform DML/DDL (INSERT, UPDATE, DELETE) and transaction commits.\n   - Can have multiple input/output parameters or return nothing.\n\n3. User-Defined Function (UDF):\n   - Must always return a single value or table.\n   - CANNOT execute DML operations (no INSERT/UPDATE) and cannot perform transaction management (no COMMIT/ROLLBACK).\n   - Can be used directly inside `SELECT` statements (e.g. `SELECT calculateTax(salary) FROM Employees`).\n\nCompanies that ask this: Oracle, TCS, Wipro, Accenture, Cognizant.",
      "code": "-- Creating a secure View:\nCREATE VIEW ActiveEmployees AS\nSELECT id, name, department \nFROM Employees \nWHERE status = 'ACTIVE';"
    },
    {
      "id": 9,
      "level": "intermediate",
      "q": "What are the 4 Database Transaction Isolation Levels and which anomalies do they prevent?",
      "a": "Summary\nQuestion: Database Isolation Levels & Concurrency Anomalies\n\nPlain answer:\nSQL standard defines 4 Isolation Levels based on which concurrency phenomena they prevent:\n\n1. Read Uncommitted:\n   - Lowest isolation. Dirty reads allowed. No shared locks.\n   - Suffers from: Dirty Read, Non-Repeatable Read, Phantom Read.\n\n2. Read Committed (Default in Postgres, Oracle, SQL Server):\n   - Reads only committed data. Holds shared locks while reading, releases immediately.\n   - Prevents: Dirty Read.\n   - Suffers from: Non-Repeatable Read, Phantom Read.\n\n3. Repeatable Read (Default in MySQL InnoDB):\n   - Guarantees re-reading a row in the same transaction yields identical data (holds shared locks until commit).\n   - Prevents: Dirty Read, Non-Repeatable Read.\n   - Suffers from: Phantom Read (in standard SQL; MySQL uses MVCC/Next-Key locks to prevent phantoms).\n\n4. Serializable:\n   - Highest isolation. Concurrent transactions produce identical result as pure serial execution.\n   - Prevents: Dirty Read, Non-Repeatable Read, Phantom Read.\n\nCompanies that ask this: Amazon, Microsoft, Uber, Stripe, Atlassian.",
      "code": "-- Setting isolation level in SQL:\nSET TRANSACTION ISOLATION LEVEL REPEATABLE READ;\nBEGIN;\n  SELECT * FROM Products WHERE id = 10;\nCOMMIT;"
    },
    {
      "id": 10,
      "level": "intermediate",
      "q": "What is the difference between a B-Tree and a B+ Tree for database indexes?",
      "a": "Summary\nQuestion: B-Tree vs B+ Tree in DBMS\n\nPlain answer:\nBoth are balanced search trees, but B+ Trees are specifically optimized for disk-based storage engines (PostgreSQL, MySQL InnoDB):\n\nKey Differences:\n1. Data Storage:\n   - B-Tree: Keys AND actual data records (pointers) are stored in BOTH internal and leaf nodes.\n   - B+ Tree: Internal nodes store ONLY routing keys; actual data records (or row pointers) are stored EXCLUSIVELY in Leaf Nodes.\n\n2. Range Queries (`WHERE age BETWEEN 20 AND 30`):\n   - B-Tree: Requires expensive in-order tree traversal (jumping back and forth between disk blocks).\n   - B+ Tree: All leaf nodes are linked together as a Doubly Linked List. Range queries simply find the first key and traverse the linked list horizontally along disk blocks.\n\n3. Node Capacity (Fanout):\n   - Because B+ Tree internal nodes store no data, more keys fit per 4KB disk page -> higher fanout, lower tree height (fewer disk I/O operations).\n\nCompanies that ask this: Google, Oracle, Amazon, Microsoft, VMware.",
      "code": "// B+ Tree Structure:\n// [Root / Internal: Keys only] -> [Leaf Nodes: Keys + Data Pointers <-> Linked List]"
    },
    {
      "id": 11,
      "level": "intermediate",
      "q": "What is the difference between SQL (Relational) and NoSQL databases?",
      "a": "Summary\nQuestion: SQL vs NoSQL\n\nPlain answer:\n\n1. Data Model:\n   - SQL: Relational tables with predefined strict schemas, rows, columns, and foreign keys.\n   - NoSQL: Dynamic/flexible schema (Document: MongoDB; Key-Value: Redis; Wide-Column: Cassandra; Graph: Neo4j).\n\n2. Scaling:\n   - SQL: Vertical scaling (scale-up: faster CPU, more RAM on a single server); complex sharding.\n   - NoSQL: Horizontal scaling (scale-out: distributed across commodity clusters automatically).\n\n3. Guarantees:\n   - SQL: ACID guarantees (strict consistency).\n   - NoSQL: BASE model (Basically Available, Soft-state, Eventual consistency) prioritizing availability under CAP theorem.\n\nWhen to choose SQL: E-commerce checkout, financial balances, ERP systems with complex JOINs.\nWhen to choose NoSQL: Real-time analytics, user activity feeds, IoT sensor logs, rapidly evolving JSON payloads.\n\nCompanies that ask this: Amazon, Google, Uber, Netflix, Infosys.",
      "code": "// SQL Table:\n// CREATE TABLE Users (id INT PRIMARY KEY, name VARCHAR(50));\n\n// NoSQL JSON Document (MongoDB):\n// db.users.insertOne({ _id: 1, name: 'Ada', tags: ['dev', 'ai'] });"
    },
    {
      "id": 12,
      "level": "beginner",
      "q": "What is an ER Diagram and what are Entity, Attribute, Relationship, and Cardinality?",
      "a": "Summary\nQuestion: Entity-Relationship (ER) Modeling\n\nPlain answer:\nAn Entity-Relationship (ER) Diagram is a graphical representation of the logical structure of a database.\n\nCore Components:\n1. Entity (Rectangle): A real-world object distinguishable from others (e.g., `Student`, `Course`).\n2. Weak Entity (Double Rectangle): An entity that cannot be uniquely identified by its own attributes alone and depends on a strong entity (e.g., `Dependent` of an Employee).\n3. Attribute (Ellipse/Oval): Property of an entity.\n   - Key Attribute (Underlined): Primary key (`RollNo`).\n   - Multivalued Attribute (Double Ellipse): Can hold multiple values (`PhoneNumbers`).\n   - Derived Attribute (Dashed Ellipse): Calculated from another attribute (`Age` calculated from `DOB`).\n4. Relationship (Diamond): Association among entities (`EnrolledIn`).\n\nCardinality Ratios:\n- 1:1 (One-to-One): One Country has one Capital.\n- 1:N (One-to-Many): One Department has many Employees.\n- N:M (Many-to-Many): Students enroll in many Courses (requires a Junction/Bridge table).",
      "code": "-- Junction Table for Many-to-Many (M:N) Relationship:\nCREATE TABLE StudentCourses (\n    student_id INT REFERENCES Students(id),\n    course_id INT REFERENCES Courses(id),\n    PRIMARY KEY (student_id, course_id)\n);"
    },
    {
      "id": 13,
      "level": "intermediate",
      "q": "What is the difference between Dense Index and Sparse Index?",
      "a": "Summary\nQuestion: Dense vs Sparse Index\n\nPlain answer:\n\n1. Dense Index:\n   - An index record appears for EVERY single search key value in the data file.\n   - Pros: Fast lookups (can determine if a record exists without touching the data file).\n   - Cons: Consumes more disk memory.\n\n2. Sparse Index:\n   - An index record appears only for some search key values (typically one entry per data block/page).\n   - Requires the data file to be physically sorted on the search key.\n   - Pros: Small index size, easily fits into memory cache.\n   - Cons: Slightly slower (finds closest lower key, then scans sequential records in that disk block).\n\nCompanies that ask this: Oracle, Microsoft, IBM, Infosys.",
      "code": "// Dense Index:  [Key 1 -> Row 1], [Key 2 -> Row 2], [Key 3 -> Row 3]\n// Sparse Index: [Key 1 -> Block 1 (Rows 1-50)], [Key 51 -> Block 2 (Rows 51-100)]"
    },
    {
      "id": 14,
      "level": "intermediate",
      "q": "What is a Lossless Join Decomposition and Dependency Preservation?",
      "a": "Summary\nQuestion: Lossless Join & Dependency Preservation\n\nPlain answer:\nWhen decomposing a relation $R$ into $R1$ and $R2$ during normalization:\n\n1. Lossless Join Property:\n   - Guarantees that performing a Natural Join ($R1 \\bowtie R2$) reconstructs the EXACT original table $R$ with zero spurious/fake rows.\n   - Condition: The common attribute ($R1 \\cap R2$) must be a Super Key for at least one of the sub-relations ($R1$ or $R2$).\n\n2. Dependency Preservation:\n   - All functional dependencies in original relation $F$ can be enforced by checking functional dependencies in $R1$ and $R2$ individually, without requiring a join.\n   - 3NF always guarantees BOTH Lossless Join and Dependency Preservation.\n   - BCNF guarantees Lossless Join, but does NOT always preserve functional dependencies.",
      "code": "// Lossless Condition Formula:\n// (R1 ∩ R2 -> R1) OR (R1 ∩ R2 -> R2)"
    },
    {
      "id": 15,
      "level": "beginner",
      "q": "What is the difference between WHERE and HAVING clause in SQL?",
      "a": "Summary\nQuestion: WHERE vs HAVING in SQL\n\nPlain answer:\n\n1. `WHERE` Clause:\n   - Filters individual rows BEFORE any grouping (`GROUP BY`) or aggregation takes place.\n   - CANNOT contain aggregate functions (`WHERE COUNT(id) > 5` is a syntax error).\n   - Works on table columns.\n\n2. `HAVING` Clause:\n   - Filters grouped summary rows AFTER `GROUP BY` and aggregation has been performed.\n   - Specifically designed to filter on aggregate functions (`HAVING COUNT(id) > 5`).\n\nExecution Order in SQL Engine:\n`FROM` -> `JOIN` -> `WHERE` -> `GROUP BY` -> `HAVING` -> `SELECT` -> `DISTINCT` -> `ORDER BY` -> `LIMIT`.",
      "code": "-- Example using BOTH WHERE and HAVING:\nSELECT department, AVG(salary) AS avg_sal\nFROM Employees\nWHERE status = 'ACTIVE'       -- Filter individual rows first\nGROUP BY department           -- Group by dept\nHAVING AVG(salary) > 50000;   -- Filter aggregated groups"
    },
    {
      "id": 16,
      "level": "beginner",
      "q": "Explain all types of SQL JOINS: INNER, LEFT, RIGHT, FULL OUTER, CROSS, and SELF JOIN.",
      "a": "Summary\nQuestion: SQL Joins Explanation\n\nPlain answer:\n\n1. INNER JOIN: Returns only rows with matching values in both tables.\n2. LEFT JOIN (Left Outer Join): Returns all rows from the left table, plus matched rows from the right table (unmatched right columns become NULL).\n3. RIGHT JOIN (Right Outer Join): Returns all rows from the right table, plus matched rows from the left table.\n4. FULL OUTER JOIN: Returns all rows when there is a match in either left or right table.\n5. CROSS JOIN: Cartesian product of both tables (multiplies $M \\times N$ rows).\n6. SELF JOIN: A table joined with itself (e.g. matching Employee to their Manager ID in the same table).",
      "code": "-- Self Join Example (Employee and Manager Name):\nSELECT e.name AS Employee, m.name AS Manager\nFROM Employees e\nLEFT JOIN Employees m ON e.manager_id = m.id;"
    },
    {
      "id": 17,
      "level": "intermediate",
      "q": "What is a Database Trigger and what are BEFORE vs AFTER triggers?",
      "a": "Summary\nQuestion: Database Triggers\n\nPlain answer:\nA Trigger is a special stored procedure that automatically executes (fires) in response to a specific event (INSERT, UPDATE, DELETE) on a table.\n\nTypes of Triggers:\n1. BEFORE Trigger: Fires BEFORE the DML operation is written to disk. Used for data validation, sanitization, or calculating auto-fields (`NEW.created_at = NOW()`).\n2. AFTER Trigger: Fires AFTER the DML operation completes. Used for audit logging, updating summary tables, or sending notifications.\n3. ROW-Level (`FOR EACH ROW`): Executes once for every single row affected by the query.\n4. STATEMENT-Level: Executes once for the whole SQL statement, regardless of how many rows changed.",
      "code": "-- Audit Log Trigger in PostgreSQL:\nCREATE TRIGGER log_user_changes\nAFTER UPDATE ON Users\nFOR EACH ROW\nEXECUTE FUNCTION record_user_audit();"
    },
    {
      "id": 18,
      "level": "intermediate",
      "q": "When should you NOT create a Database Index?",
      "a": "Summary\nQuestion: Indexing Pitfalls & Trade-offs\n\nPlain answer:\nWhile indexes speed up `SELECT` queries, they come with substantial costs and should NOT be added indiscriminately:\n\n1. Heavy Write Workloads: Every `INSERT`, `UPDATE`, and `DELETE` must rebalance and write to all B+ Tree indexes, degrading write throughput.\n2. Low Cardinality Columns: Indexing a boolean `is_active` (values: true/false) or `gender` (M/F) is wasteful because the query planner will prefer a Full Table Scan.\n3. Small Tables: Scanning a table with 200 rows in RAM is faster than traversing a B+ Tree index.\n4. Columns with frequent updates: Constant index node splits and fragmentation.\n5. Disk Storage: Indexes consume significant disk memory and RAM buffer pool space.",
      "code": "-- Tip: Use EXPLAIN ANALYZE to verify if index is actually used:\nEXPLAIN ANALYZE SELECT * FROM Users WHERE email = 'ada@example.com';"
    },
    {
      "id": 19,
      "level": "intermediate",
      "q": "What is Database Sharding vs Replication?",
      "a": "Summary\nQuestion: Database Sharding vs Replication\n\nPlain answer:\n\n1. Database Replication:\n   - Copies the exact same database to multiple servers.\n   - Primary (Leader) handles writes; Read Replicas (Followers) handle read queries.\n   - Solves: Read scalability and high availability failover if Primary crashes.\n   - Limitation: Does NOT scale write capacity or storage (every replica holds the entire dataset).\n\n2. Database Sharding (Horizontal Partitioning):\n   - Splits database rows across multiple independent physical database machines using a Shard Key.\n   - Example: Users with ID 1-1,000,000 on Node A; Users 1,000,001-2,000,000 on Node B.\n   - Solves: Massive dataset storage and write scalability beyond one physical machine.\n   - Drawbacks: Cross-shard joins are slow and complex; re-sharding is painful.",
      "code": "// Sharding Strategy:\n// Node 1: hash(user_id) % 3 == 0\n// Node 2: hash(user_id) % 3 == 1\n// Node 3: hash(user_id) % 3 == 2"
    },
    {
      "id": 20,
      "level": "intermediate",
      "q": "What is the CAP Theorem and PACELC Theorem in Distributed Databases?",
      "a": "Summary\nQuestion: CAP and PACELC Theorems\n\nPlain answer:\n\n1. CAP Theorem (Eric Brewer):\nIn a distributed database system, when a Network Partition ($P$) occurs, you can choose only ONE of the following:\n- Consistency ($C$): Every read receives the most recent write or an error (CP systems: HBase, MongoDB primary).\n- Availability ($A$): Every non-failing node returns a response, but it may contain stale data (AP systems: Cassandra, DynamoDB).\n\n2. PACELC Theorem (Daniel Abadi):\nExpands CAP by addressing what happens during normal operation (when there is NO partition):\n- If Partition ($P$), trade-off Availability ($A$) vs Consistency ($C$).\n- Else ($E$), trade-off Latency ($L$) vs Consistency ($C$).\n(e.g., MongoDB is PC/EC; Cassandra is PA/EL).",
      "code": "// Distributed Trade-off Summary:\n// CAP: On network failure, pick Consistency (halt writes) OR Availability (serve stale)"
    },
    {
      "id": 21,
      "level": "intermediate",
      "q": "What is the difference between DELETE, TRUNCATE, and DROP in SQL?",
      "a": "Summary\nQuestion: DELETE vs TRUNCATE vs DROP\n\nPlain answer:\n\n1. `DELETE` (DML Command):\n   - Removes specific rows matching a `WHERE` clause.\n   - Logs every single deleted row in transaction log (can be rolled back).\n   - Slower for huge tables; maintains identity counter.\n\n2. `TRUNCATE` (DDL Command):\n   - Removes ALL rows from a table by deallocating the underlying data pages.\n   - Resets auto-increment identity counter; cannot use `WHERE` clause.\n   - Extremely fast; minimal logging.\n\n3. `DROP` (DDL Command):\n   - Completely deletes the table data AND the table schema definition from the database dictionary.\n   - Drops all indexes, triggers, and constraints associated with the table.",
      "code": "-- DDL vs DML Comparison:\nDELETE FROM Users WHERE status = 'BANNED'; -- DML (selective, logged)\nTRUNCATE TABLE TempLogs;                 -- DDL (fast wipe, resets identity)\nDROP TABLE OldUsers;                     -- DDL (destroys table structure)"
    }
  ]
};
