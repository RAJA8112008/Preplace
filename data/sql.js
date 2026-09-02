window.PREP_DATA = window.PREP_DATA || {};
window.PREP_DATA.sql = {
  notes: [
    { title: "Before you use SQL", body: "The problem before\nUsers lived in a JSON file or a spreadsheet on one laptop. Two people took the same email. An order saved with no user. A payment succeeded but stock did not drop.\n\nWhat this is\nSQL is a language for tables. Decide what one row means (one student, one order), mark the unique id, then talk to one engine — PostgreSQL or SQLite.\n\nWhat it solves\nA shared, safe ledger: this email is unique, this order belongs to this user, this payment and this stock change happen together.\n\nReal-life example\nA school register. One row per student. One roll number that cannot repeat. A mark sheet that must point at a real student. The clerk cannot invent roll 99.\n\nUses\nUsers, orders, money, marks, anything you will join or report on. Add Redis later for speed. Add Mongo later if a document is the natural shape.\n\nWatch out\nStarting with five databases. UPDATE or DELETE without WHERE." },
    { title: "Why SQL still wins", body: "Before you use this\nKnow the four verbs: INSERT adds, SELECT reads, UPDATE changes, DELETE removes. Know that WHERE picks rows. That is enough to be useful.\n\nWhy we use it\nConstraints live in the database, not only in your Node code. UNIQUE email, FOREIGN KEY to a real user, NOT NULL name — a buggy route cannot silently save junk. Transactions keep two money updates as one yes-or-no. Interviews and jobs still treat SQL as the default store.\n\nAlso know\nPostgreSQL, MySQL, SQL Server, and SQLite all speak SQL. The ideas transfer. Postgres is the usual pick for new web apps. SQLite is perfect for learning and small tools." },
    { title: "Relational idea", body: "A relational database stores data in tables. A table is a grid with named columns and rows. A column has a type, like INTEGER or TEXT. A row is one record, like one student. Keys relate tables so you do not copy everything into one giant sheet. SQL is the language you type. PostgreSQL, MySQL, and SQL Server are engines that run that language. Each engine also has extra words of its own." },
    { title: "Keys", body: "A primary key uniquely identifies a row. It cannot be empty, and no two rows may share it. A foreign key is a column whose values must match a key in another table. UNIQUE stops duplicate emails or other business keys. NOT NULL means the column cannot be empty. These constraints protect data even if the app has a bug. Joins and updates use keys so you do not mix people up." },
    { title: "CRUD", body: "CRUD is Create, Read, Update, Delete. In SQL that is INSERT, SELECT, UPDATE, and DELETE. SELECT reads rows. INSERT adds rows. UPDATE changes rows and DELETE removes them. Always use a WHERE on UPDATE and DELETE, or you change every row. A transaction is a bundle of writes that should succeed together. Practice the four verbs on a tiny table first." },
    { title: "Joins", body: "A join combines rows from two tables using a match rule. INNER JOIN keeps only pairs that match. LEFT JOIN keeps every row from the left table, and fills NULL when the right side has no match. RIGHT JOIN is a flipped LEFT JOIN. FULL JOIN keeps unmatched rows from both sides. Think in sets of rows, not nested loops, even if the planner uses loops. Write ON with keys, not a missing ON that explodes into a CROSS JOIN." },
    { title: "NULL", body: "NULL means unknown, not the number zero and not always empty text. NULL = NULL is unknown, not true. Use IS NULL to test emptiness. Aggregates skip NULL in COUNT(column) and AVG. LEFT JOIN produces NULLs on the unmatched side. You must handle those NULLs in reports. COALESCE picks the first value that is not NULL." },
    { title: "Indexes", body: "An index is an extra lookup structure, usually a B-tree. B-tree helps equality, ranges, and ORDER BY. Indexes speed reads and slow writes a bit, because INSERT and UPDATE must maintain them. Index the columns you filter and join on. Too many indexes hurt writes. EXPLAIN shows whether a query used an index. A sequential scan reads the whole table and can be fine on tiny data." },
    { title: "Normalization", body: "Normalization splits data so each fact lives in one place. 1NF means atomic values, not a list stuffed in one cell. 2NF means no fact that depends on only part of a composite key. 3NF means no fact that depends on another non-key column. Denormalize later for read speed, with eyes open. Start normalized. Duplicate only with a plan. Update anomalies happen when the same address is copied on every order." },
    { title: "Transactions", body: "A transaction is a bundle of SQL that should succeed together. ACID is Atomicity, Consistency, Isolation, Durability. BEGIN starts, COMMIT saves, and ROLLBACK undoes. Isolation levels trade how much you see of other work versus waiting. A deadlock is two transactions waiting on each other; the database aborts one and you retry. Keep transactions short so locks do not last." },
    { title: "EXPLAIN", body: "EXPLAIN shows the plan: how the database intends to run the SQL. EXPLAIN ANALYZE actually runs it and shows real times. Seq scan versus index scan, join type, and row estimates matter. Slow query? EXPLAIN ANALYZE first. Compare estimated rows versus actual rows. A big miss means bad stats or a bad plan. Use it on a copy of production-sized data when you can." },
    { title: "Injection", body: "SQL injection is hostile text becoming extra SQL. Never concatenate user input into a SQL string. Use parameters like $1 or ? from your driver or ORM. The SQL text stays fixed and the value stays data. Even ORM raw helpers are dangerous if you interpolate strings. Show a parameterized query. This is still one of the most serious web bugs." },
    { title: "Types", body: "Use proper types. timestamptz stores a real instant with a time zone. numeric is exact decimals, good for money. boolean is true or false, uuid is a wide unique id, and jsonb is binary JSON you can index. Strings for everything is a trap. Hidden conversions make comparisons weird. Prefer storing the right type from the start." },
    { title: "Interview habit", body: "Before you write SQL, say the grain: one row per what? State assumed keys. Say how NULL should behave. Decide whether you need DISTINCT. Write the join before SELECT *. Mention indexes for WHERE and JOIN columns. Readable SQL beats a clever one-liner. Say assumptions out loud: unique keys, timezone, what latest means." },
  ],
  questions: [
    { id: 1, level: "beginner", q: "What is SQL?",
      a: "The problem before\nUsers lived in a JSON file or a spreadsheet on one laptop. Two people took the same email. An order saved with no user. A payment succeeded but stock did not drop.\n\nWhat this is\nSQL is a language for talking to tables. You save, find, change, and delete rows. The engine is Postgres, MySQL, or SQLite — not JavaScript.\n\nWhat it solves\nA shared ledger with rules. UNIQUE email, FOREIGN KEY to a real user, BEGIN/COMMIT so two money updates succeed together. A buggy route cannot silently save junk.\n\nReal-life example\nA school register: one row per student, one roll number that cannot repeat, one mark sheet that must point at a real student.\n\nUses\nUsers, orders, money, marks, anything you will join or report on.\n\nWhat happens\nYou write SELECT / INSERT / UPDATE / DELETE. The engine plans the query, uses indexes, and returns a table of rows.\n\nWatch out\nUPDATE or DELETE without WHERE. Treating every engine as the same dialect.",
      code: `-- ask the database to show student names
SELECT name
FROM students;

-- this is SQL: a sentence the database understands` },
    { id: 2, level: "beginner", q: "What is a relational database?",
      a: "A relational database stores data in tables, like spreadsheet sheets with rules. Each table has columns with types, and rows that are records.\n\nTables connect through keys, not through one giant messy sheet. A query's answer is also a table. This model is the default for money, users, and orders.\n\nIn the code: CREATE TABLE students has id and name. CREATE TABLE courses has id and title. Two tables, not one mixed sheet.\n\nA common mistake is stuffing students and courses into one table with repeating course columns.",
      code: `CREATE TABLE students (
  id   INTEGER,
  name TEXT
);

CREATE TABLE courses (
  id    INTEGER,
  title TEXT
);` },
    { id: 3, level: "beginner", q: "What is a primary key?",
      a: "A primary key is a column, or a few columns, that is unique for every row. It cannot be empty.\n\nPeople often use an id number or a UUID. The database will refuse two rows with the same primary key. Joins and updates use this id so you do not mix people up.\n\nIn the code: id is SERIAL PRIMARY KEY, so it becomes 1, 2, 3 and unique. name is NOT NULL. INSERT only sends Ada, and the id is generated.\n\nA common mistake is using a person's name as the only primary key.",
      code: `CREATE TABLE students (
  id   SERIAL PRIMARY KEY, -- 1, 2, 3... unique
  name TEXT NOT NULL
);

INSERT INTO students (name) VALUES ('Ada');` },
    { id: 4, level: "beginner", q: "What is a foreign key?",
      a: "A foreign key is a column whose values must match a key in another table. It stops you from saving course 99 if course 99 does not exist.\n\nThat rule is called referential integrity. Without foreign keys, orphan rows pile up. You still write joins yourself. The key only protects the data.\n\nIn the code: enroll.student_id REFERENCES students(id), and course_id REFERENCES courses(id). student_id must be a real students.id.\n\nA common mistake is storing student_id with no REFERENCES, then joining to missing people.",
      code: `CREATE TABLE enroll (
  student_id INTEGER REFERENCES students (id),
  course_id  INTEGER REFERENCES courses (id)
);

-- student_id must be a real students.id` },
    { id: 5, level: "beginner", q: "What is a unique constraint?",
      a: "UNIQUE means no two rows may share the same value in that column, or set of columns. It is like a primary key, but you can have more than one unique rule.\n\nEmails are a common unique field. In PostgreSQL, several NULLs are usually allowed in a unique column, because NULL means unknown. If you need at most one email, unique is the database's promise.\n\nIn the code: users has id as PRIMARY KEY and email TEXT UNIQUE. INSERT of ada@test.com will fail a second time with the same email.\n\nA common mistake is checking uniqueness only in the app, so two signups at once both succeed.",
      code: `CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  email TEXT UNIQUE  -- two users cannot share an email
);

INSERT INTO users (email) VALUES ('ada@test.com');` },
    { id: 6, level: "beginner", q: "SELECT vs INSERT vs UPDATE vs DELETE?",
      a: "SELECT reads rows. INSERT adds rows. UPDATE changes rows. DELETE removes rows.\n\nUPDATE and DELETE without WHERE change every row. That is a famous disaster. Always double-check WHERE before you run a write. CRUD is Create, Read, Update, Delete. Practice them on a tiny table first.\n\nIn the code: INSERT adds Ada. SELECT reads names. UPDATE changes Ada to Ada Lovelace only WHERE name = Ada. DELETE removes that row.\n\nA common mistake is UPDATE students SET name = 'x' with no WHERE.",
      code: `INSERT INTO students (name) VALUES ('Ada');
SELECT name FROM students;
UPDATE students SET name = 'Ada Lovelace' WHERE name = 'Ada';
DELETE FROM students WHERE name = 'Ada Lovelace';` },
    { id: 7, level: "beginner", q: "What does WHERE do?",
      a: "WHERE filters rows using a condition, like marks >= 80. It runs before grouping.\n\nHAVING is the filter after GROUP BY, which is a later topic. Without WHERE, SELECT returns the whole table. Write the filter clearly. Parentheses help when you mix AND and OR.\n\nIn the code: SELECT name, marks FROM students WHERE marks >= 80 keeps only those rows. The comment says without WHERE you get the whole table.\n\nA common mistake is putting an aggregate like COUNT(*) in WHERE instead of HAVING.",
      code: `SELECT name, marks
FROM students
WHERE marks >= 80;  -- only these rows
-- without WHERE you get the whole table` },
    { id: 8, level: "beginner", q: "AND vs OR vs NOT?",
      a: "AND means both must be true. OR means at least one. NOT flips true to false.\n\nParentheses matter: A AND B OR C is not the same as A AND (B OR C). A messy OR can also make it harder for the database to use an index. When a query looks wrong, add parentheses first. Say the sentence in English, then write SQL.\n\nIn the code: the first query needs marks >= 80 AND city = Pune. The second query keeps Pune OR Delhi.\n\nA common mistake is mixing AND and OR with no parentheses and getting extra rows.",
      code: `SELECT name
FROM students
WHERE marks >= 80
  AND city = 'Pune';     -- both must match

SELECT name FROM students
WHERE city = 'Pune' OR city = 'Delhi';` },
    { id: 9, level: "beginner", q: "LIKE vs = ?",
      a: "= means the value is exactly the same. LIKE lets you use % for anything here and _ for one character.\n\nLIKE '%n%' finds names with n anywhere. That can be slow on a big table. A pattern that starts with % often cannot use a normal index well. For user search, you may later learn full-text tools.\n\nIn the code: name = 'Ada' is exact. LIKE 'Ada%' starts with Ada. LIKE '%da' ends with da.\n\nA common mistake is LIKE '%term%' on a huge table as your only search plan.",
      code: `SELECT name FROM students WHERE name = 'Ada';     -- exact
SELECT name FROM students WHERE name LIKE 'Ada%'; -- starts with Ada
SELECT name FROM students WHERE name LIKE '%da';  -- ends with da
-- % means any characters, _ means one character` },
    { id: 10, level: "beginner", q: "What is ORDER BY?",
      a: "ORDER BY puts rows in a sequence, like highest marks first. ASC is low to high, the default. DESC is high to low.\n\nYou can sort by a column name. Big sorts are cheaper if an index matches the order. Without ORDER BY, the database may return rows in any convenient order.\n\nIn the code: ORDER BY marks DESC lists highest marks first. The comment notes ASC is the default.\n\nA common mistake is assuming SELECT always returns rows in insert order.",
      code: `SELECT name, marks
FROM students
ORDER BY marks DESC;  -- highest marks first
-- ASC is low to high (the default)` },
    { id: 11, level: "beginner", q: "LIMIT / OFFSET?",
      a: "LIMIT 10 means only 10 rows. OFFSET 20 means skip 20, then take.\n\nLarge OFFSET is slow because the database still walks over the skipped rows. A stabler style is WHERE id > last_id ORDER BY id LIMIT 10. Always cap LIMIT so a client cannot ask for the whole table.\n\nIn the code: ORDER BY id LIMIT 10 OFFSET 20 is page 3 if page size is 10.\n\nA common mistake is OFFSET 100000 on a busy feed.",
      code: `SELECT id, name
FROM students
ORDER BY id
LIMIT 10 OFFSET 20;  -- page 3 if page size is 10` },
    { id: 12, level: "beginner", q: "What is DISTINCT?",
      a: "DISTINCT keeps unique rows in the SELECT list. It costs extra work.\n\nOften duplicates mean your JOIN matched too many times, or you wanted GROUP BY instead. Do not sprinkle DISTINCT to hide a bad join forever. If you need counts, COUNT(DISTINCT ...) is related but different.\n\nIn the code: SELECT DISTINCT city lists each city once. GROUP BY city is another way.\n\nA common mistake is DISTINCT to cover up a join that multiplied rows.",
      code: `SELECT DISTINCT city
FROM students;  -- each city once
-- duplicates often mean a join matched too widely
SELECT city FROM students GROUP BY city;  -- another way` },
    { id: 13, level: "beginner", q: "COUNT(*) vs COUNT(column)?",
      a: "COUNT(*) counts rows, even if some columns are empty. COUNT(column) counts only rows where that column is not NULL.\n\nCOUNT(DISTINCT column) counts unique non-null values. This surprise shows up after LEFT JOIN, which creates NULLs. Say which one you mean.\n\nIn the code: COUNT(*) is all_rows. COUNT(email) is rows_with_email and skips NULL emails.\n\nA common mistake is using COUNT(email) when you meant to count every student.",
      code: `SELECT COUNT(*) AS all_rows,
       COUNT(email) AS rows_with_email
FROM students;
-- COUNT(email) skips NULL emails` },
    { id: 14, level: "beginner", q: "What are aggregate functions?",
      a: "Aggregate functions squash many rows into a number. COUNT, SUM, AVG, MIN, and MAX are the common ones.\n\nThey collapse a group of rows into one answer. If you also select a normal column, that column must be in GROUP BY in strict SQL. AVG skips NULL scores. Use them for reports: totals, averages, top values.\n\nIn the code: COUNT(*) is n, AVG(marks) is avg_marks, MAX(marks) is best, all from students.\n\nA common mistake is SELECT name, AVG(marks) without GROUP BY name.",
      code: `SELECT COUNT(*) AS n,
       AVG(marks) AS avg_marks,
       MAX(marks) AS best
FROM students;` },
    { id: 15, level: "beginner", q: "GROUP BY?",
      a: "GROUP BY city means make a bucket per city, then aggregate each bucket. The SELECT list should be grouped columns or aggregates.\n\nHow many students per city is the classic example. If you forget GROUP BY, the database will complain or give a wrong single row. HAVING filters those piles afterwards.\n\nIn the code: SELECT city, COUNT(*) GROUP BY city gives one row per city pile.\n\nA common mistake is grouping by city but selecting name, which is not unique per city.",
      code: `SELECT city, COUNT(*) AS n
FROM students
GROUP BY city;
-- one row per city pile` },
    { id: 16, level: "intermediate", q: "WHERE vs HAVING?",
      a: "WHERE removes rows before grouping. HAVING removes groups after you already aggregated.\n\nKeep cities where COUNT(*) > 10. That is HAVING. Filtering marks > 50 before you group is WHERE. If you put COUNT in WHERE, SQL will not like it.\n\nIn the code: WHERE marks >= 40 filters rows first. GROUP BY city. HAVING COUNT(*) >= 2 then filters groups.\n\nA common mistake is writing WHERE COUNT(*) >= 2.",
      code: `SELECT city, COUNT(*) AS n
FROM students
WHERE marks >= 40          -- filter rows first
GROUP BY city
HAVING COUNT(*) >= 2;      -- then filter groups` },
    { id: 17, level: "intermediate", q: "INNER JOIN?",
      a: "INNER JOIN keeps only pairs that match the ON condition. If a student has no enrollment, they disappear from this result. If a course has no students, it disappears too.\n\nWrite ON with the keys, not a comma-style accidental cross join. Most list orders with user names reports start as INNER JOIN.\n\nIn the code: students INNER JOIN enroll on student_id, then INNER JOIN courses on course_id. The SELECT shows name and title.\n\nA common mistake is forgetting ON and exploding into every combination.",
      code: `SELECT students.name, courses.title
FROM students
INNER JOIN enroll ON enroll.student_id = students.id
INNER JOIN courses ON courses.id = enroll.course_id;` },
    { id: 18, level: "intermediate", q: "LEFT JOIN?",
      a: "LEFT JOIN keeps every row from the left table. If the right side has no match, those columns are NULL.\n\nUsers and their optional profile is the usual story. INNER JOIN would drop students with no club. Know which table is left: it is the one named first in FROM.\n\nIn the code: FROM students LEFT JOIN clubs ON clubs.id = students.club_id. Students without a club still appear.\n\nA common mistake is filtering a right-table column in WHERE and accidentally turning LEFT into INNER.",
      code: `SELECT students.name, clubs.name AS club
FROM students
LEFT JOIN clubs ON clubs.id = students.club_id;
-- students without a club still appear` },
    { id: 19, level: "intermediate", q: "RIGHT JOIN and FULL JOIN?",
      a: "RIGHT JOIN is a LEFT JOIN with the tables flipped. FULL JOIN keeps unmatched rows from both sides.\n\nNot every database loves FULL JOIN the same way. You can emulate it with UNION of LEFT and RIGHT. In interviews, say you usually write LEFT JOIN and put the must-keep table on the left. RIGHT JOIN is rare in hand-written SQL.\n\nIn the code: students FULL JOIN courses on favorite_course_id. Unmatched students AND unmatched courses both stay.\n\nA common mistake is using RIGHT JOIN when swapping the FROM order would be clearer.",
      code: `SELECT s.name, c.title
FROM students AS s
FULL JOIN courses AS c ON c.id = s.favorite_course_id;
-- unmatched students AND unmatched courses both stay` },
    { id: 20, level: "intermediate", q: "CROSS JOIN?",
      a: "CROSS JOIN pairs every left row with every right row. 3 students and 4 sizes make 12 rows.\n\nThat is useful to generate combinations, like every user with every day of a week. An accidental CROSS JOIN, missing ON, explodes row counts and looks like a bug. If your result suddenly has millions of rows, look for a missing join condition.\n\nIn the code: students CROSS JOIN sizes. Every student times every size.\n\nA common mistake is a JOIN with no ON that silently becomes a cross product.",
      code: `SELECT s.name, sz.label
FROM students AS s
CROSS JOIN sizes AS sz;  -- every student x every size
-- missing ON on a JOIN can do this by accident` },
    { id: 21, level: "intermediate", q: "self join?",
      a: "A self join is joining a table to itself. When a relationship lives in one table, you need two nicknames for the same table.\n\nEmployees and their managers is the classic: both are rows in employees. You join on manager_id = other.id. Aliases e and m keep the columns from clashing. Without a self join, who is Ada's manager is awkward in one scan.\n\nIn the code: employees AS e LEFT JOIN employees AS m ON m.id = e.manager_id. The SELECT lists employee and manager names.\n\nA common mistake is joining without aliases so name clashes with itself.",
      code: `SELECT e.name AS employee,
       m.name AS manager
FROM employees AS e
LEFT JOIN employees AS m ON m.id = e.manager_id;` },
    { id: 22, level: "intermediate", q: "ON vs WHERE on a LEFT JOIN?",
      a: "ON decides how rows match. If you filter a right-table column in WHERE, rows with NULL on the right fail the test and vanish. Then your LEFT JOIN behaves like INNER JOIN.\n\nPut only active clubs in ON if you still want students with no club. This is a favourite interview trap.\n\nIn the code: LEFT JOIN clubs ON c.id = s.club_id AND c.active = TRUE. Students still appear even if the club is missing.\n\nA common mistake is WHERE c.active = TRUE after a LEFT JOIN, which drops students with no club.",
      code: `SELECT s.name, c.name AS club
FROM students AS s
LEFT JOIN clubs AS c
  ON c.id = s.club_id
 AND c.active = TRUE;  -- keep students even if club is missing` },
    { id: 23, level: "intermediate", q: "What is a subquery?",
      a: "A subquery is a SELECT used in WHERE, FROM, or SELECT. In FROM it acts like a temporary table.\n\nA correlated subquery mentions the outer row and can run many times. That can be slow. EXISTS or a JOIN is often clearer. Start with a non-correlated IN subquery. It is easier to read.\n\nIn the code: students whose id is IN a subquery of enroll for course_id 10.\n\nA common mistake is a correlated subquery in a huge table when a JOIN would be enough.",
      code: `SELECT name
FROM students
WHERE id IN (
  SELECT student_id FROM enroll WHERE course_id = 10
);` },
    { id: 24, level: "intermediate", q: "IN vs EXISTS vs JOIN for 'has at least one'?",
      a: "EXISTS can stop at the first match and handles some NULL IN-list issues better. IN is easy to read for small lists. JOIN can duplicate the outer student if they have many enrollments. Then you need DISTINCT or EXISTS.\n\nPick EXISTS when you only care that at least one child row exists. Explain duplicates if you choose JOIN.\n\nIn the code: SELECT s.name WHERE EXISTS a row in enroll with that student_id.\n\nA common mistake is JOIN enroll and then wondering why Ada appears three times.",
      code: `SELECT s.name
FROM students AS s
WHERE EXISTS (
  SELECT 1 FROM enroll AS e
  WHERE e.student_id = s.id
);` },
    { id: 25, level: "intermediate", q: "UNION vs UNION ALL?",
      a: "UNION ALL pastes the rows together and keeps duplicates. UNION also removes duplicate rows, which costs extra work.\n\nBoth need the same number of columns and compatible types. If you know there are no duplicates, UNION ALL is cheaper. Order is not guaranteed unless you ORDER BY the final result.\n\nIn the code: staff names UNION ALL student names keep duplicates. city UNION of staff and students is unique cities.\n\nA common mistake is UNION when you wanted every row including duplicates, and the query got slow.",
      code: `SELECT name FROM staff
UNION ALL
SELECT name FROM students;  -- keep duplicates

SELECT city FROM staff
UNION
SELECT city FROM students;  -- unique cities` },
    { id: 26, level: "intermediate", q: "What is a CTE?",
      a: "A CTE is a named subquery at the top of a statement, WITH ... AS. It makes long SQL easier to read, like a local variable for a table.\n\nYou can chain several CTEs. In old PostgreSQL versions a CTE could block some optimizations. Newer versions are smarter. Use them when nested subqueries start to look like a maze.\n\nIn the code: WITH passers AS SELECT id, name WHERE marks >= 40. Then SELECT name FROM passers ORDER BY name.\n\nA common mistake is nesting five subqueries in FROM instead of naming steps.",
      code: `WITH passers AS (
  SELECT id, name FROM students WHERE marks >= 40
)
SELECT name FROM passers
ORDER BY name;` },
    { id: 27, level: "intermediate", q: "window functions?",
      a: "A window function looks at related rows but does not collapse the result like GROUP BY. Each input row can still appear, with an extra column like a rank or a running sum.\n\nROW_NUMBER, RANK, and SUM() OVER are common. PARTITION BY restarts the numbering in each group. You need this for latest order per user and running totals.\n\nIn the code: RANK() OVER (PARTITION BY city ORDER BY marks DESC) AS city_rank. Each student row stays. Rank is an extra column.\n\nA common mistake is GROUP BY when you still needed every row plus a rank.",
      code: `SELECT name, city, marks,
       RANK() OVER (PARTITION BY city ORDER BY marks DESC) AS city_rank
FROM students;
-- each student row stays; rank is an extra column` },
    { id: 28, level: "intermediate", q: "ROW_NUMBER vs RANK vs DENSE_RANK?",
      a: "ROW_NUMBER gives a unique 1,2,3 even when scores tie. Ties get an arbitrary order unless you add more ORDER BY columns. RANK gives ties the same number, then skips: 1,1,3. DENSE_RANK gives ties the same number without a gap: 1,1,2.\n\nSay which skip behaviour the product wants. For exactly one latest row, ROW_NUMBER is the usual tool.\n\nIn the code: the SELECT lists ROW_NUMBER, RANK, and DENSE_RANK all OVER ORDER BY marks DESC.\n\nA common mistake is using RANK when you needed exactly one row per user.",
      code: `SELECT name, marks,
       ROW_NUMBER() OVER (ORDER BY marks DESC) AS rn,
       RANK() OVER (ORDER BY marks DESC) AS rk,
       DENSE_RANK() OVER (ORDER BY marks DESC) AS dr
FROM students;` },
    { id: 29, level: "intermediate", q: "How do you get the latest row per user?",
      a: "Give each user's rows a number ordered by time descending, then keep number 1. PostgreSQL also has DISTINCT ON (user_id), which is shorter there.\n\nDo not use GROUP BY user_id with MAX(created_at) then forget to join back. You might pick the wrong other columns. Always define latest with a real timestamp or id. Index (user_id, created_at DESC) helps this query.\n\nIn the code: an inner SELECT adds ROW_NUMBER PARTITION BY user_id ORDER BY created_at DESC. The outer query keeps rn = 1.\n\nA common mistake is GROUP BY user_id and selecting amount without joining back to the max time.",
      code: `SELECT user_id, created_at, amount
FROM (
  SELECT user_id, created_at, amount,
         ROW_NUMBER() OVER (
           PARTITION BY user_id ORDER BY created_at DESC
         ) AS rn
  FROM payments
) AS t
WHERE rn = 1;` },
    { id: 30, level: "intermediate", q: "What is NULL-safe comparison?",
      a: "In SQL, NULL means unknown. NULL = NULL is not true. IS NULL tests emptiness. IS NOT DISTINCT FROM in Postgres treats two NULLs as equal.\n\nCOALESCE(a,0) = COALESCE(b,0) is a hack if 0 is a real value. When you merge rows, decide how NULLs should compare. This matters in UPSERT and in JOIN conditions too.\n\nIn the code: WHERE nickname IS NULL is the correct test. IS NOT DISTINCT FROM other_name matches NULLs in Postgres.\n\nA common mistake is WHERE nickname = NULL, which never matches.",
      code: `SELECT *
FROM students
WHERE nickname IS NULL;  -- correct test

SELECT *
FROM students
WHERE nickname IS NOT DISTINCT FROM other_name; -- Postgres: NULLs match` },
    { id: 31, level: "beginner", q: "What does COALESCE do?",
      a: "COALESCE(a, b, c) walks the list and returns the first one that is not NULL. It is perfect for defaults: nickname, else name, else Guest.\n\nAll arguments should be compatible types. It does not mean zero. Zero is a value. NULL is missing. Use it in SELECT lists and in reports so the UI does not show blanks.\n\nIn the code: COALESCE(nickname, name, 'Guest') AS label. First non-null wins.\n\nA common mistake is treating empty string and NULL as the same without deciding that on purpose.",
      code: `SELECT COALESCE(nickname, name, 'Guest') AS label
FROM students;
-- first non-null wins: nickname, else name, else Guest
-- NULL is missing, not the same as empty text always` },
    { id: 32, level: "beginner", q: "CAST / type conversion?",
      a: "CAST(x AS integer) turns text or another type into an integer when it can. PostgreSQL also allows x::int as a short form.\n\nHidden conversions can make comparisons weird, like text vs number. If the text is hello, the cast will fail. Prefer storing the right type from the start.\n\nIn the code: CAST('42' AS INTEGER) and '42'::INT both become 42. CAST('hello' AS INTEGER) would fail.\n\nA common mistake is storing numbers as TEXT and then sorting 10 before 2.",
      code: `SELECT CAST('42' AS INTEGER) AS n;
SELECT '42'::INT AS n_too;  -- Postgres short form
-- CAST('hello' AS INTEGER) would fail
-- prefer the right type when you save the data` },
    { id: 33, level: "intermediate", q: "char vs varchar vs text?",
      a: "CHAR(n) pads with spaces to a fixed length. That is old-fashioned for most apps. VARCHAR(n) is text with a max length. TEXT in PostgreSQL is unlimited and very common.\n\nUse VARCHAR or TEXT plus a CHECK if you need a length rule. Do not pick CHAR unless a spec forces a fixed width code.\n\nIn the code: code CHAR(3) is padded. title VARCHAR(80) has a max. body TEXT is long text in Postgres.\n\nA common mistake is CHAR(50) for names, then surprising trailing spaces.",
      code: `CREATE TABLE labels (
  code CHAR(3),        -- old style, padded
  title VARCHAR(80),   -- max 80 chars
  body TEXT            -- long text in Postgres
);` },
    { id: 34, level: "intermediate", q: "integer vs numeric vs float?",
      a: "INTEGER is exact whole numbers. NUMERIC or DECIMAL is exact decimals. Use it for money. FLOAT and REAL are approximate. 0.1 + 0.2 may not look like 0.3.\n\nNever store currency in float if you can avoid it. Integers are great for counts and ids.\n\nIn the code: products has INTEGER id, NUMERIC(10, 2) price, and REAL rating.\n\nA common mistake is FLOAT for money, then cents drift.",
      code: `CREATE TABLE products (
  id    INTEGER,
  price NUMERIC(10, 2), -- money: exact
  rating REAL           -- approximate is ok here
);` },
    { id: 35, level: "intermediate", q: "timestamp vs timestamptz?",
      a: "timestamptz stores a moment in UTC and converts when you display it. timestamp without time zone is just a wall-clock value with no zone.\n\nPrefer timestamptz for real events: created_at, paid_at. Apps should send UTC and let the UI show the user's zone. Mixing the two types causes off-by-hours bugs.\n\nIn the code: events.created_at is TIMESTAMPTZ NOT NULL DEFAULT NOW().\n\nA common mistake is timestamp without time zone for a worldwide event time.",
      code: `CREATE TABLE events (
  id         SERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);` },
    { id: 36, level: "intermediate", q: "What is a view?",
      a: "A view is a saved SELECT that looks like a table when you query it. A normal view does not store its own copy of the rows. It runs the query each time.\n\nViews help permissions and hide ugly joins. If you need stored results, that is a materialized view. Do not treat a view as a magic speed button. It can still be slow.\n\nIn the code: CREATE VIEW student_names AS SELECT id, name FROM students. Then SELECT name FROM student_names.\n\nA common mistake is assuming a view is always faster than the underlying query.",
      code: `CREATE VIEW student_names AS
SELECT id, name
FROM students;

SELECT name FROM student_names;` },
    { id: 37, level: "intermediate", q: "materialized view?",
      a: "A materialized view saves the query output like a snapshot. You must REFRESH it when you want newer data.\n\nIt is good for heavy reports that can be a little stale. You can index a materialized view. Do not use it for data that must be second-by-second correct.\n\nIn the code: city_counts groups students by city. REFRESH MATERIALIZED VIEW city_counts when you need a new snapshot.\n\nA common mistake is reading a materialized view as if it were live after every insert.",
      code: `CREATE MATERIALIZED VIEW city_counts AS
SELECT city, COUNT(*) AS n
FROM students
GROUP BY city;

-- REFRESH MATERIALIZED VIEW city_counts;  -- when you need a new snapshot` },
    { id: 38, level: "intermediate", q: "What is an index?",
      a: "An index is an extra structure, usually a B-tree, like a book index. It helps WHERE, JOIN, and ORDER BY on those columns.\n\nIt uses disk space and makes INSERT, UPDATE, DELETE a bit slower, because the index must update too. Index the columns you actually filter and join on. Too many indexes can hurt writes.\n\nIn the code: CREATE INDEX students_city_idx ON students (city). Then SELECT name WHERE city = Pune.\n\nA common mistake is indexing every column just in case.",
      code: `CREATE INDEX students_city_idx
ON students (city);

SELECT name FROM students WHERE city = 'Pune';` },
    { id: 39, level: "intermediate", q: "clustered vs secondary index?",
      a: "In MySQL InnoDB, the primary key is clustered: the row lives in primary key order. Secondary indexes point at the primary key, then to the row.\n\nPostgreSQL tables are heaps by default. CLUSTER is a manual rewrite, not the same as InnoDB clustering. Pick a stable, not-too-wide primary key in InnoDB. You do not need the word clustered to use Postgres well, but interviews mention it.\n\nIn the code: users.id is PRIMARY KEY. users_email_idx on email is secondary.\n\nA common mistake is a huge random UUID primary key in InnoDB without knowing the clustering cost.",
      code: `CREATE TABLE users (
  id    INTEGER PRIMARY KEY, -- InnoDB: rows stored in this order
  email TEXT NOT NULL
);

CREATE INDEX users_email_idx ON users (email); -- secondary` },
    { id: 40, level: "intermediate", q: "composite index?",
      a: "CREATE INDEX ON t (a, b) helps WHERE a = ? AND b = ?. It often also helps WHERE a = ? because a is the first column, the prefix.\n\nIt usually does not help WHERE only b = ?. Put equality columns that you always have first. Order of columns in the index matters.\n\nIn the code: enroll_student_course is (student_id, course_id). The SELECT filters both.\n\nA common mistake is indexing (course_id, student_id) when every query only has student_id.",
      code: `CREATE INDEX enroll_student_course
ON enroll (student_id, course_id);

SELECT * FROM enroll
WHERE student_id = 5 AND course_id = 10;` },
    { id: 41, level: "intermediate", q: "covering index?",
      a: "A covering index has every column the query needs. Then the database can answer from the index without fetching the full table row.\n\nIn PostgreSQL you can INCLUDE extra columns on an index for this. It saves time on hot read queries. Do not include huge TEXT columns just in case. Name the columns in SELECT. SELECT * rarely gets a covering index.\n\nIn the code: students_city_name is (city) INCLUDE (name). SELECT name WHERE city = Pune can stay in the index.\n\nA common mistake is SELECT * and expecting a covering index.",
      code: `CREATE INDEX students_city_name
ON students (city) INCLUDE (name);

SELECT name FROM students WHERE city = 'Pune';
-- name is in the index, so the heap may not be needed` },
    { id: 42, level: "advanced", q: "when does an index not get used?",
      a: "Wrapping the column in a function, like LOWER(name) = ..., can block a normal index. A type mismatch can too. A leading % in LIKE can too.\n\nIf almost every row matches, a full scan can be cheaper. Stale statistics can make the planner guess wrong. Fix the query to match the index, or add a functional index.\n\nIn the code: WHERE LOWER(name) = 'ada' may skip a normal index on name. Better: store consistent case, or index LOWER(name).\n\nA common mistake is blaming Seq Scan without checking a function on the column.",
      code: `-- this may skip a normal index on name
SELECT * FROM students WHERE LOWER(name) = 'ada';

-- better: store and search a consistent case, or index LOWER(name)` },
    { id: 43, level: "advanced", q: "partial index?",
      a: "A partial index has a WHERE clause. CREATE INDEX ... WHERE status = 'open' only indexes the hot subset.\n\nIt is smaller and faster for that common filter. Unpaid invoices or unread messages are typical. The query must include that same idea so the planner can use it. Do not partial-index a filter you rarely use.\n\nIn the code: invoices_open_idx on due_date WHERE status = 'open'. The SELECT also has status = open and due_date < CURRENT_DATE.\n\nA common mistake is a partial index that does not match the query's WHERE.",
      code: `CREATE INDEX invoices_open_idx
ON invoices (due_date)
WHERE status = 'open';

SELECT * FROM invoices
WHERE status = 'open' AND due_date < CURRENT_DATE;` },
    { id: 44, level: "advanced", q: "expression / functional index?",
      a: "If you always search LOWER(email), index LOWER(email). The query must use the same expression to match.\n\nGreat for case-insensitive login lookups. Keep the expression simple. Generated columns are a related idea in some databases.\n\nIn the code: users_email_lower is ON users (LOWER(email)). The SELECT uses LOWER(email) = LOWER('Ada@Test.com').\n\nA common mistake is indexing email but querying LOWER(email).",
      code: `CREATE INDEX users_email_lower
ON users (LOWER(email));

SELECT id FROM users
WHERE LOWER(email) = LOWER('Ada@Test.com');` },
    { id: 45, level: "intermediate", q: "GIN vs B-tree?",
      a: "B-tree is the default: equality and ranges on normal columns. GIN is good for jsonb, arrays, and full-text tokens: does this document contain this key?\n\nGiST shows up for geometry and some text search. Pick the index type that matches the query, not the one that sounds fancier. Most beginners only need B-tree at first.\n\nIn the code: students_name_btree on name. posts_body_gin uses GIN on to_tsvector. Then SELECT WHERE name = Ada uses the B-tree.\n\nA common mistake is a GIN index on a plain integer id.",
      code: `CREATE INDEX students_name_btree ON students (name);      -- B-tree
CREATE INDEX posts_body_gin ON posts USING GIN (to_tsvector('english', body));
-- B-tree: equality and ranges. GIN: many keys per row
SELECT name FROM students WHERE name = 'Ada';` },
    { id: 46, level: "intermediate", q: "What is EXPLAIN ANALYZE?",
      a: "EXPLAIN shows the plan: how the database intends to run the SQL. EXPLAIN ANALYZE actually runs it and shows real times and row counts.\n\nYou compare estimates versus actual rows. A big miss means bad stats or a bad plan. Use it on a copy of production-sized data when you can. It is the first tool, before you rewrite everything.\n\nIn the code: EXPLAIN ANALYZE SELECT name FROM students WHERE city = Pune.\n\nA common mistake is rewriting the query for a week without reading the plan.",
      code: `EXPLAIN ANALYZE
SELECT name
FROM students
WHERE city = 'Pune';` },
    { id: 47, level: "advanced", q: "nested loop vs hash vs merge join?",
      a: "Nested loop is good when one side is small and the other is found by index. Hash join builds a hash table for larger equality joins. Merge join needs both sides sorted and then walks them together.\n\nThe planner chooses. Wrong row estimates pick the wrong one. You rarely force a join type. You fix indexes and stats.\n\nIn the code: EXPLAIN of students JOIN enroll. The plan may say Nested Loop, Hash Join, or Merge Join.\n\nA common mistake is forcing a join type instead of fixing the missing index.",
      code: `EXPLAIN
SELECT s.name, e.course_id
FROM students AS s
JOIN enroll AS e ON e.student_id = s.id;
-- the plan may say Nested Loop, Hash Join, or Merge Join` },
    { id: 48, level: "intermediate", q: "What is a sequential scan?",
      a: "A sequential scan reads the whole table from start to finish. That is fine for a tiny table, or when you need most rows anyway.\n\nIt hurts when the table is huge and you only wanted a few rows. Then you want an index scan instead. Do not panic at Seq Scan on a 20-row table.\n\nIn the code: EXPLAIN SELECT * FROM students is likely Seq Scan because you asked for every row. EXPLAIN SELECT WHERE id = 1 is the contrast.\n\nA common mistake is adding indexes because EXPLAIN showed Seq Scan on a toy table.",
      code: `EXPLAIN
SELECT * FROM students;  -- likely Seq Scan: you asked for every row
-- a full table read is fine when you wanted every row
EXPLAIN SELECT name FROM students WHERE id = 1;` },
    { id: 49, level: "beginner", q: "What is normalization?",
      a: "Normalization reduces copies of the same fact. If an address is stored on every order, a move means updating many rows, and some will be wrong.\n\nYou split repeating groups into their own tables and link with keys. Later you may denormalize on purpose for speed. Start normalized. Duplicate only with a plan.\n\nIn the code: cities has id and unique name. students.city_id REFERENCES cities(id).\n\nA common mistake is city as loose text on every student row with five spellings of Pune.",
      code: `-- not normalized: city repeated as loose text everywhere
-- better: city in one place, students point at it
CREATE TABLE cities (id SERIAL PRIMARY KEY, name TEXT UNIQUE);
CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  city_id INTEGER REFERENCES cities (id)
);` },
    { id: 50, level: "intermediate", q: "1NF 2NF 3NF quickly?",
      a: "1NF: one value per cell, no repeating groups like phone1 phone2 as extra columns. 2NF: no fact that depends on only part of a composite key. 3NF: no fact that depends on another non-key column, like city depending on zip in a sloppy way.\n\nYou do not need to recite a textbook. You need to avoid update anomalies. Interviews want a tiny example more than a proof.\n\nIn the code: enroll has student_id and course_id as a composite PRIMARY KEY. Names are not jammed as Ada, Grace in one cell.\n\nA common mistake is phone1, phone2, phone3 columns instead of a phones table.",
      code: `-- 1NF: atomic values, not "Ada, Grace" in one name cell
CREATE TABLE enroll (
  student_id INTEGER,
  course_id INTEGER,
  PRIMARY KEY (student_id, course_id)  -- composite key
);` },
    { id: 51, level: "intermediate", q: "denormalization when?",
      a: "If a join-heavy read is too slow, you might store a cached count or a duplicated name. You accept that two places must stay in sync.\n\nDocument who updates the copy. Do this after you measure, not on day one. Indexes and better queries often beat denormalization.\n\nIn the code: courses.student_count copies COUNT(*). UPDATE adds 1 when someone enrolls in course 10.\n\nA common mistake is denormalizing on day one before you have a slow query.",
      code: `ALTER TABLE courses
ADD COLUMN student_count INTEGER NOT NULL DEFAULT 0;
-- copy of COUNT(*), faster to read, you must update it on enroll
UPDATE courses SET student_count = student_count + 1 WHERE id = 10;` },
    { id: 52, level: "beginner", q: "one-to-many vs many-to-many?",
      a: "One-to-many: one author, many books. The foreign key sits on the many side, books.author_id. Many-to-many: students and courses. You need a join table with two foreign keys.\n\nPutting a course_id on students only allows one course. That is the usual beginner mistake. Name the join table clearly: enroll, order_items, post_tags. The join table can also hold extra facts, like a grade.\n\nIn the code: books.author_id REFERENCES authors. enroll has student_id and course_id.\n\nA common mistake is course_id on students for a many-to-many problem.",
      code: `-- one-to-many
CREATE TABLE books (id SERIAL PRIMARY KEY, author_id INTEGER REFERENCES authors (id));

-- many-to-many
CREATE TABLE enroll (
  student_id INTEGER REFERENCES students (id),
  course_id INTEGER REFERENCES courses (id)
);` },
    { id: 53, level: "intermediate", q: "one-to-one?",
      a: "One-to-one puts a foreign key with a UNIQUE constraint so each parent has at most one child row. Use it to split optional, wide, or sensitive columns.\n\nYou could put everything in one table. Splitting can help permissions and width. Do not over-split into dozens of 1:1 tables without a reason. The unique FK is what makes it one-to-one, not the table name.\n\nIn the code: user_profiles.user_id is PRIMARY KEY REFERENCES users(id). Unique plus FK is 1:1.\n\nA common mistake is a non-unique user_id so one user gets five profiles.",
      code: `CREATE TABLE user_profiles (
  user_id INTEGER PRIMARY KEY REFERENCES users (id), -- unique + FK = 1:1
  bio TEXT
);` },
    { id: 54, level: "intermediate", q: "What is a surrogate key vs natural key?",
      a: "A surrogate is generated: serial, identity, UUID. A natural key is something from the world: email, ISBN.\n\nNatural keys can change and are often wide. Surrogates stay stable. Still put a UNIQUE constraint on the business key so emails do not duplicate. Interviews like: use an id, unique the email.\n\nIn the code: books.id is SERIAL PRIMARY KEY. isbn is TEXT NOT NULL UNIQUE. title is required.\n\nA common mistake is primary key on email, then the user changes email.",
      code: `CREATE TABLE books (
  id    SERIAL PRIMARY KEY,      -- surrogate
  isbn  TEXT NOT NULL UNIQUE,    -- natural business key
  title TEXT NOT NULL
);` },
    { id: 55, level: "intermediate", q: "UUID vs serial ids?",
      a: "SERIAL or identity is short and increases in order. Inserts pack nicely in a B-tree. UUID is unique across machines and hides how many rows you have.\n\nRandom UUIDs can scatter index writes. Time-ordered UUIDs (v7) help. Either is fine if you understand the trade. Do not mix without a plan. APIs sometimes expose UUIDs so users cannot guess /users/7.\n\nIn the code: table a uses SERIAL. table b uses UUID DEFAULT gen_random_uuid(). INSERT INTO a DEFAULT VALUES.\n\nA common mistake is exposing serial ids in URLs when you did not want people to guess the next user.",
      code: `CREATE TABLE a (id SERIAL PRIMARY KEY);
CREATE TABLE b (id UUID PRIMARY KEY DEFAULT gen_random_uuid());
-- serial is short and ordered; uuid is unique across machines
INSERT INTO a DEFAULT VALUES;` },
    { id: 56, level: "beginner", q: "What is ACID?",
      a: "ACID is four promises of a transaction. Atomicity: all of the steps happen, or none do. Consistency: rules like keys and checks still hold after. Isolation: two shoppers should not wreck each other's cart math. Durability: after COMMIT, a crash should not lose the write.\n\nSQL databases are famous for this. You still have to put related writes in one transaction. Say the four words and one tiny example.\n\nIn the code: BEGIN, subtract 10 from account 1, add 10 to account 2, COMMIT. Both happen, or neither.\n\nA common mistake is two UPDATEs with autocommit so a crash can leave money missing.",
      code: `BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;
COMMIT;  -- both happen, or neither` },
    { id: 57, level: "intermediate", q: "What is a transaction?",
      a: "A transaction is a bundle of SQL that should succeed together. COMMIT saves the bundle. ROLLBACK undoes it.\n\nUse it when two writes must not be half-done, like stock and order. One statement is often auto-committed if you do not open a transaction. Keep transactions short so locks do not last.\n\nIn the code: BEGIN, INSERT order, INSERT order_items using currval of the order id, COMMIT.\n\nA common mistake is inserting the order, then failing the items, and leaving an empty order.",
      code: `BEGIN;
INSERT INTO orders (user_id) VALUES (1);
INSERT INTO order_items (order_id, sku) VALUES (currval('orders_id_seq'), 'ABC');
COMMIT;` },
    { id: 58, level: "intermediate", q: "autocommit?",
      a: "Many clients commit after every single statement. That is fine for one UPDATE.\n\nIf two statements must succeed together, you must start an explicit transaction. ORMs have a transaction helper. Use it around checkout. Know your driver's default so you are not surprised.\n\nIn the code: UPDATE stock and INSERT order as two lines. The comment says wrap both in BEGIN ... COMMIT in real checkout.\n\nA common mistake is assuming two statements are atomic because they sat next to each other in a file.",
      code: `-- each line may commit alone if autocommit is on
UPDATE products SET stock = stock - 1 WHERE id = 5;
INSERT INTO orders (product_id) VALUES (5);
-- wrap both in BEGIN ... COMMIT in real checkout` },
    { id: 59, level: "advanced", q: "isolation levels?",
      a: "Read uncommitted, read committed, repeatable read, and serializable are the usual ladder. Higher isolation means fewer weird reads, more waiting or retries.\n\nPostgreSQL default is read committed. You do not pick serializable for every query. You pick it when the bugs are real. Name one anomaly you prevent.\n\nIn the code: BEGIN ISOLATION LEVEL REPEATABLE READ, SELECT balance, COMMIT. Another transaction cannot change what this snapshot sees.\n\nA common mistake is SERIALIZABLE on every request and then wondering why everything retries.",
      code: `BEGIN ISOLATION LEVEL REPEATABLE READ;
SELECT balance FROM accounts WHERE id = 1;
-- another transaction cannot change what this snapshot sees
COMMIT;` },
    { id: 60, level: "advanced", q: "dirty read, non-repeatable, phantom?",
      a: "A dirty read sees data that another transaction has not committed yet and might roll back. A non-repeatable read means the same row changes if you read it twice. A phantom means a new row appears that matches your WHERE.\n\nIsolation levels say which of these you allow. PostgreSQL does not do dirty reads in the usual levels. Being able to define the three words is the interview win.\n\nIn the code: two SELECTs of marks for id 1. Someone else UPDATEs to 100 and COMMITs in between. In READ COMMITTED the second SELECT may differ.\n\nA common mistake is mixing up dirty read and phantom.",
      code: `-- non-repeatable idea: two SELECTs, another UPDATE in between
SELECT marks FROM students WHERE id = 1;
-- someone else: UPDATE students SET marks = 100 WHERE id = 1; COMMIT;
SELECT marks FROM students WHERE id = 1;  -- may differ in READ COMMITTED` },
    { id: 61, level: "advanced", q: "MVCC?",
      a: "MVCC means multiple versions of a row can exist for a while. Readers see a snapshot instead of waiting for every writer to finish.\n\nWriters create a new version. Old versions wait to be cleaned. VACUUM later removes dead versions. You do not turn MVCC on. It is how Postgres works. Long transactions delay cleanup.\n\nIn the code: UPDATE marks to 90. The old version still exists until VACUUM. Other readers with an old snapshot can still see 80.\n\nA common mistake is a transaction that stays open for hours and blocks vacuum.",
      code: `UPDATE students SET marks = 90 WHERE id = 1;
-- old version of the row still exists until VACUUM
-- other readers with an old snapshot can still see 80
SELECT marks FROM students WHERE id = 1;` },
    { id: 62, level: "intermediate", q: "deadlock?",
      a: "A deadlock is two transactions waiting on each other. A grabs row 1 and wants row 2. B grabs row 2 and wants row 1. Neither can move.\n\nThe database aborts one. You retry the loser. Keep lock order the same. Keep transactions short. Deadlocks are not always a design crime. High traffic makes them more likely. Log and retry is the practical answer.\n\nIn the code: session A BEGIN UPDATEs id 1. Session B updates id 2 then wants id 1. If A then wants id 2, one session is aborted.\n\nA common mistake is locking rows in random order in two code paths.",
      code: `-- session A
BEGIN;
UPDATE accounts SET balance = balance - 1 WHERE id = 1;
-- session B (same time) updates id 2 then wants id 1
-- if A then wants id 2, one session is aborted` },
    { id: 63, level: "intermediate", q: "SELECT FOR UPDATE?",
      a: "SELECT ... FOR UPDATE locks the selected rows until you COMMIT. Nobody else can UPDATE those rows in the meantime.\n\nUse it for read the stock, then decrement if you cannot do it in one UPDATE. It can reduce throughput because others wait. Prefer a single UPDATE stock = stock - 1 WHERE stock >= 1 when you can.\n\nIn the code: BEGIN, SELECT stock FOR UPDATE, UPDATE stock - 1, COMMIT.\n\nA common mistake is SELECT stock with no lock, then UPDATE, so two buyers both see 1.",
      code: `BEGIN;
SELECT stock FROM products WHERE id = 5 FOR UPDATE;
UPDATE products SET stock = stock - 1 WHERE id = 5;
COMMIT;` },
    { id: 64, level: "advanced", q: "optimistic vs pessimistic locking?",
      a: "Pessimistic: lock first with FOR UPDATE, then change. Safe when clashes are common. Optimistic: store a version number. UPDATE ... WHERE version = old. If zero rows, someone else won.\n\nOptimistic is nicer when clashes are rare. Web apps often use version columns on documents. Retry the failed optimistic update.\n\nIn the code: UPDATE documents SET body and version = version + 1 WHERE id = 9 AND version = 3. Zero rows means another user already saved version 4.\n\nA common mistake is UPDATE by id only and overwriting a newer edit.",
      code: `UPDATE documents
SET body = 'new', version = version + 1
WHERE id = 9 AND version = 3;
-- if 0 rows, another user already saved version 4` },
    { id: 65, level: "intermediate", q: "lost update?",
      a: "Two transactions read balance 100. Both subtract 10. Both write 90. You lost one subtraction.\n\nFix with a transaction plus a lock, or one statement: SET balance = balance - 10. Never read into the app, math in the app, write back for money without a version or lock. Test with two concurrent updates.\n\nIn the code: UPDATE accounts SET balance = balance - 10 WHERE id = 1 AND balance >= 10.\n\nA common mistake is SELECT balance, subtract in JS, UPDATE the new number.",
      code: `-- safe: the database does the math once
UPDATE accounts
SET balance = balance - 10
WHERE id = 1 AND balance >= 10;` },
    { id: 66, level: "beginner", q: "What is a schema?",
      a: "In PostgreSQL, a schema is a namespace: a folder of tables inside one database. public is the default. People also say schema to mean the shape of the data: columns and types.\n\nsearch_path decides which schema name is assumed. Do not confuse it with a schema-less document database. CREATE SCHEMA is how you make a new drawer.\n\nIn the code: CREATE SCHEMA shop. Then shop.products with id and name.\n\nA common mistake is mixing the two meanings of schema in one sentence and confusing yourself.",
      code: `CREATE SCHEMA shop;

CREATE TABLE shop.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL
);` },
    { id: 67, level: "intermediate", q: "DDL vs DML vs DCL?",
      a: "DDL is structure: CREATE, ALTER, DROP. DML is data: SELECT, INSERT, UPDATE, DELETE. DCL is permissions: GRANT, REVOKE.\n\nSome people call COMMIT and ROLLBACK TCL, transaction control. Migrations are mostly DDL plus some DML backfills. You need the words so docs and error messages make sense.\n\nIn the code: CREATE TABLE is DDL. INSERT is DML. GRANT SELECT is DCL. COMMIT is TCL.\n\nA common mistake is calling SELECT DDL because it is SQL.",
      code: `CREATE TABLE t (id INT);          -- DDL
INSERT INTO t (id) VALUES (1);    -- DML
GRANT SELECT ON t TO app_user;    -- DCL
COMMIT;                           -- TCL` },
    { id: 68, level: "intermediate", q: "ALTER TABLE online?",
      a: "Some ALTERs are cheap, like adding a nullable column in PostgreSQL. Changing a type or adding a foreign key may rewrite the table and block writes.\n\nPlan migrations like you plan deploys. Test the ALTER on a copy of production-sized data. Split dangerous changes into steps.\n\nIn the code: ADD COLUMN nickname TEXT is often cheap if nullable. ALTER COLUMN marks TYPE BIGINT may rewrite.\n\nA common mistake is a type change on a huge table during peak traffic.",
      code: `ALTER TABLE students
ADD COLUMN nickname TEXT;  -- often cheap if nullable

-- ALTER TABLE students ALTER COLUMN marks TYPE BIGINT; -- may rewrite` },
    { id: 69, level: "intermediate", q: "CASCADE on delete?",
      a: "ON DELETE CASCADE means if you delete a parent row, the database also deletes matching child rows. That is convenient and dangerous.\n\nOften you prefer RESTRICT so you cannot delete a customer who still has orders. Soft-delete is another pattern: set deleted_at instead. Know which FKs cascade before you DELETE FROM users.\n\nIn the code: comments.post_id REFERENCES posts(id) ON DELETE CASCADE. Deleting a post deletes its comments.\n\nA common mistake is CASCADE on users so deleting a user wipes orders you still needed.",
      code: `CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  post_id INTEGER REFERENCES posts (id) ON DELETE CASCADE
);
-- deleting a post deletes its comments` },
    { id: 70, level: "intermediate", q: "soft delete?",
      a: "Soft delete keeps the row but marks it gone with deleted_at. Every query must remember to hide deleted rows.\n\nUnique emails get harder: two deleted users might still clash unless you use a partial unique index. Undo is easier. Disk and indexes still hold the row. Be consistent. Mixing hard and soft delete is confusing.\n\nIn the code: ADD COLUMN deleted_at. UNIQUE INDEX on email WHERE deleted_at IS NULL.\n\nA common mistake is UNIQUE(email) plus soft delete, so a deleted user blocks signup forever.",
      code: `ALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;

CREATE UNIQUE INDEX users_email_alive
ON users (email)
WHERE deleted_at IS NULL;` },
    { id: 71, level: "beginner", q: "What is SQL injection?",
      a: "If you glue a user name into a string, they can add extra SQL. The fix is parameters: the SQL text has $1, and the value is sent separately.\n\nEven ORM raw helpers are dangerous if you interpolate strings. This is still one of the most serious web bugs. Show a parameterized query.\n\nIn the code: the bad idea concatenates quotes. The good query is WHERE name = $1.\n\nA common mistake is \"WHERE name = '\" + userInput + \"'\".",
      code: `-- bad idea: 'SELECT * FROM users WHERE name = ''' || user_input
-- good: placeholder, value stays data
SELECT id, name
FROM users
WHERE name = $1;` },
    { id: 72, level: "intermediate", q: "prepared statements?",
      a: "A prepared statement means the database parses SQL once with placeholders. You bind values later, many times if you want.\n\nThat blocks injection and can speed repeated queries. Drivers often prepare for you when you pass a params array. Do not concatenate and then prepare the result. That is too late.\n\nIn the code: SELECT id FROM users WHERE email = $1. First run ada@test.com. Second run grace@test.com.\n\nA common mistake is building the SQL string first, then preparing the glued string.",
      code: `-- prepared idea: same SQL, different values
SELECT id FROM users WHERE email = $1;
-- first run: $1 = 'ada@test.com'
-- second run: $1 = 'grace@test.com'` },
    { id: 73, level: "intermediate", q: "ORM vs raw SQL?",
      a: "An ORM maps tables to objects and speeds simple CRUD and migrations. Complex reports, window functions, and tight performance often need raw SQL.\n\nKnow both. We never write SQL is a red flag on a data-heavy team. Log SQL in development so you see N+1. Keep raw SQL in named files or functions, not scattered strings.\n\nIn the code: the ORM idea is User.findAll(). The raw SQL is city counts GROUP BY city ORDER BY n DESC.\n\nA common mistake is an ORM query that hides a 50-join monster.",
      code: `-- ORM style (idea): User.findAll()
-- raw SQL when the report is special
SELECT city, COUNT(*) AS n
FROM students
GROUP BY city
ORDER BY n DESC;` },
    { id: 74, level: "intermediate", q: "N+1 with ORMs?",
      a: "You load 50 users, then the ORM lazy-loads profile for each one: 51 queries. That is N+1.\n\nFix with a join, include, select-related, or a dataloader. Turn on SQL logging while you develop. If the page gets slower as the list grows, suspect N+1.\n\nIn the code: SELECT * FROM users, then SELECT profiles WHERE user_id = 1, then = 2. Better: JOIN or WHERE user_id IN (...).\n\nA common mistake is a loop of findProfile(user.id) in the app.",
      code: `-- slow pattern the ORM may emit
SELECT * FROM users;
SELECT * FROM profiles WHERE user_id = 1;
SELECT * FROM profiles WHERE user_id = 2;
-- better: JOIN or WHERE user_id IN (1,2,...)` },
    { id: 75, level: "intermediate", q: "What is json/jsonb in Postgres?",
      a: "json is text-ish. jsonb is binary, indexable, and the one you usually want. Great for optional bags of attributes you do not want as columns yet.\n\nBad as a replacement for all modelling: constraints and joins get harder. You can GIN-index jsonb for key lookups. Keep core fields as real columns.\n\nIn the code: products has name TEXT and extras JSONB default {}. SELECT WHERE extras ->> 'color' = 'blue'.\n\nA common mistake is putting price only in jsonb and then sorting money as text.",
      code: `CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  extras JSONB DEFAULT '{}'::jsonb
);

SELECT name FROM products WHERE extras ->> 'color' = 'blue';` },
    { id: 76, level: "advanced", q: "when not to use jsonb?",
      a: "If you filter, sort, and constrain a field all day, it wants to be a column. If many reports join on it, columns win.\n\nA leftover extras jsonb for rare keys is a fair compromise. Start with columns. Add jsonb for leftovers.\n\nIn the code: ALTER ADD COLUMN color TEXT, index it, SELECT WHERE color = blue.\n\nA common mistake is a giant jsonb blob for fields you always search.",
      code: `-- prefer a real column for something you always search
ALTER TABLE products ADD COLUMN color TEXT;
CREATE INDEX products_color_idx ON products (color);
SELECT name FROM products WHERE color = 'blue';` },
    { id: 77, level: "intermediate", q: "full-text search in Postgres?",
      a: "to_tsvector turns text into tokens. to_tsquery is the search. A GIN index on the tsvector makes it usable.\n\nIt is good enough for many apps before you add Elasticsearch. Language matters: english stemming is different from simple. Rank results with ts_rank if you need an order.\n\nIn the code: WHERE to_tsvector('english', body) @@ to_tsquery('english', 'sql & join'). @@ means the text search matches.\n\nA common mistake is LIKE '%sql%' on huge posts with no tsvector plan.",
      code: `SELECT title
FROM posts
WHERE to_tsvector('english', body) @@ to_tsquery('english', 'sql & join');
-- @@ means the text search matches` },
    { id: 78, level: "intermediate", q: "ILIKE and trigram?",
      a: "ILIKE is LIKE without caring about case. '%foo%' is still hard for a normal B-tree. pg_trgm can index similarity and some LIKE patterns using GIN or GiST.\n\nIt still costs more than a plain equality lookup. For serious product search, full-text or a search engine may still be better.\n\nIn the code: CREATE EXTENSION pg_trgm. GIN index on name with gin_trgm_ops. SELECT WHERE name ILIKE '%ada%'.\n\nA common mistake is ILIKE '%ada%' on millions of rows with no trigram index.",
      code: `CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX students_name_trgm ON students USING GIN (name gin_trgm_ops);

SELECT name FROM students WHERE name ILIKE '%ada%';` },
    { id: 79, level: "beginner", q: "What is a constraint check?",
      a: "A check constraint is a rule per row, like price >= 0. The database refuses a row that breaks it.\n\nIt is the last line of defence besides app validation. Use checks for simple truths. Complex business rules may live in the app. Name your constraints so errors are readable.\n\nIn the code: products.price NUMERIC(10, 2) CHECK (price >= 0).\n\nA common mistake is only checking price in the UI.",
      code: `CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  price NUMERIC(10, 2) CHECK (price >= 0)
);` },
    { id: 80, level: "intermediate", q: "exclusion constraint?",
      a: "An exclusion constraint can say two bookings for the same room cannot share time. It uses GiST and range types.\n\nThis is nicer than checking overlaps only in app code, which can race. Calendars and reservations love this. It is more advanced than UNIQUE, but the idea is unique in a geometric sense.\n\nIn the code: EXCLUDE USING GIST (room_id WITH =, during WITH &&) on bookings.\n\nA common mistake is two overlapping inserts that both passed an app-only overlap check.",
      code: `CREATE TABLE bookings (
  room_id INTEGER,
  during  TSTZRANGE,
  EXCLUDE USING GIST (room_id WITH =, during WITH &&)
);` },
    { id: 81, level: "intermediate", q: "What is a trigger?",
      a: "A trigger calls a function when a row changes on INSERT, UPDATE, or DELETE. Audit logs are a fair use: copy old and new values to a history table.\n\nHiding core business rules only in triggers makes app developers blind. Prefer app code for rules the team must see daily. Do not chain triggers into a maze.\n\nIn the code: log_name_change INSERTs OLD.id and OLD.name into audit, then RETURN NEW.\n\nA common mistake is putting the only copy of pricing rules in a trigger nobody reads.",
      code: `CREATE FUNCTION log_name_change() RETURNS trigger AS $$
BEGIN
  INSERT INTO audit (student_id, old_name) VALUES (OLD.id, OLD.name);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;` },
    { id: 82, level: "intermediate", q: "stored procedure vs app code?",
      a: "A stored procedure is SQL or PLpgSQL saved in the database. It can cut round trips. It is harder to test, version, and share with a mixed-language team.\n\nUse sparingly unless the company standardizes on it. Most web teams keep logic in the app and use SQL for data. A little PL/pgSQL for one hot path can still be fine.\n\nIn the code: add_marks(a, b) RETURNS INTEGER and RETURNs a + b in plpgsql.\n\nA common mistake is moving all business logic into procedures so the Node team cannot test it.",
      code: `CREATE FUNCTION add_marks(a INTEGER, b INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN a + b;
END;
$$ LANGUAGE plpgsql;` },
    { id: 83, level: "intermediate", q: "connection pooling why?",
      a: "A connection is expensive to start. A pool keeps a few connections warm and loans them out.\n\nServerless functions plus Postgres can open too many connections. Then you want a pooler like PgBouncer. Leak a client, forget to release, and the taxi stand goes empty. Size the pool for the database, not for as many as Node can spawn.\n\nIn the code: SELECT 1 AS ok is a cheap check that a borrowed connection works. Then give it back in app code.\n\nA common mistake is new Pool() inside every request.",
      code: `-- app idea: reuse one pool
-- SELECT 1 is a cheap check that a borrowed connection works
SELECT 1 AS ok;
-- then give the connection back to the pool in app code` },
    { id: 84, level: "advanced", q: "PgBouncer transaction vs session pooling?",
      a: "Session pooling: one client keeps one server connection for the whole session. Simple, fewer surprises. Transaction pooling: the server connection is reused between transactions. You get more clients than server slots.\n\nTemp tables and some prepared statement styles can break in transaction pooling. Know which mode your app can survive. Scaling many web processes is when this choice shows up.\n\nIn the code: BEGIN, SELECT, COMMIT. Next request may get a different server connection.\n\nA common mistake is transaction pooling plus session-level temp tables.",
      code: `-- transaction pooling: each COMMIT returns the server connection
BEGIN;
SELECT id FROM users WHERE email = $1;
COMMIT;
-- next request may get a different server connection` },
    { id: 85, level: "intermediate", q: "read replica?",
      a: "A replica is a follower that replays writes from the primary. You can send heavy SELECTs there to protect the primary.\n\nReplication lag means the replica might be slightly behind. Writes still go to the primary. Reporting and extra read traffic are the usual reasons.\n\nIn the code: a heavy GROUP BY COUNT on students runs on a replica. Writes still go to the primary. This SELECT may be a second behind.\n\nA common mistake is INSERT then immediately SELECT from a lagged replica.",
      code: `-- run heavy reports on a replica (same SQL, different host)
SELECT city, COUNT(*) FROM students GROUP BY city;
-- writes still go to the primary
-- this SELECT may be a second behind` },
    { id: 86, level: "advanced", q: "replication lag bugs?",
      a: "The user writes on the primary, then immediately reads a replica, and their new row is missing. Fix by reading the primary for that session, or waiting until the replica catches up.\n\nThis is called read-your-writes. Chat and checkout flows are sensitive to this. Do not send load the user we just created to a lagged replica.\n\nIn the code: INSERT RETURNING id, then SELECT by email. If the SELECT hits a lagging replica, this id may not appear yet.\n\nA common mistake is a signup that says user not found on the next page.",
      code: `INSERT INTO users (email) VALUES ('ada@test.com') RETURNING id;
-- if the next SELECT hits a lagging replica, this id may not appear yet
SELECT * FROM users WHERE email = 'ada@test.com';
-- read-your-writes: use the primary for that moment` },
    { id: 87, level: "intermediate", q: "backup vs replication?",
      a: "Replication is for availability and extra reads. If you DELETE everything, replicas delete it too. A backup is a snapshot you can restore from last night or a point in time.\n\nTest restore or you do not have a backup. You have a hope. Corruption copies to mirrors. Backups can save you if they are old enough and clean. Do both.\n\nIn the code: SELECT COUNT(*) is live. A replica would show the same COUNT after a bad DELETE. A backup from last night would still have the old COUNT.\n\nA common mistake is calling a replica a backup.",
      code: `-- backups are copies of data at a time, not this live query
SELECT COUNT(*) FROM students;
-- a replica would show the same COUNT after it catches up, even after a bad DELETE
-- a backup from last night would still have the old COUNT` },
    { id: 88, level: "intermediate", q: "VACUUM in Postgres?",
      a: "MVCC leaves dead row versions after UPDATE and DELETE. VACUUM reclaims that space, and frozen tuples, in simple terms.\n\nAutovacuum usually does this. If it lags, tables bloat and queries slow down. You rarely VACUUM FULL in production without a plan. It locks. Watch bloat on busy update tables.\n\nIn the code: VACUUM ANALYZE students. ANALYZE refreshes statistics. Autovacuum usually does this. Then a peek at pg_stat_user_tables.\n\nA common mistake is turning autovacuum off because it looked busy.",
      code: `VACUUM ANALYZE students;
-- ANALYZE also refreshes statistics the planner uses
-- autovacuum usually does this for you
SELECT relname FROM pg_stat_user_tables;` },
    { id: 89, level: "advanced", q: "index bloat?",
      a: "Dead tuples leave junk in indexes too. REINDEX or a concurrent rebuild can shrink them during a maintenance window.\n\nMonitor bloat on tables that update all day. VACUUM helps tables. Indexes may still need a rebuild. Do not REINDEX everything blindly every night without measuring.\n\nIn the code: REINDEX INDEX CONCURRENTLY students_city_idx. Then CREATE INDEX IF NOT EXISTS as a reminder of the index.\n\nA common mistake is REINDEX ALL every night on a live primary.",
      code: `REINDEX INDEX CONCURRENTLY students_city_idx;
-- rebuild one bloated index without a long write lock (Postgres)
-- do this after you measure bloat, not every night blindly
CREATE INDEX IF NOT EXISTS students_city_idx ON students (city);` },
    { id: 90, level: "beginner", q: "What is a migration tool?",
      a: "A migration is a versioned SQL or code file: add column, add index. Tools run them in order on each environment.\n\nNever edit a migration that already ran in production. Add a new file. The app version and the database version must stay compatible. Keep migrations in git with the app.\n\nIn the code: 001_add_nickname.sql is ALTER TABLE students ADD COLUMN nickname TEXT. Never edit this file after it already ran in production.\n\nA common mistake is editing 001 after production already applied it.",
      code: `-- 001_add_nickname.sql
ALTER TABLE students
ADD COLUMN nickname TEXT;
-- never edit this file after it already ran in production` },
    { id: 91, level: "intermediate", q: "how do you add an index in production?",
      a: "In PostgreSQL, CREATE INDEX CONCURRENTLY builds the index without a long write lock. It takes more time and has extra rules: no wrapping in a big transaction, in simple terms.\n\nWatch the database while it runs. Drop unused indexes later so writes stay cheap. A plain CREATE INDEX on a huge table can block writes.\n\nIn the code: CREATE INDEX CONCURRENTLY students_email_idx ON students (email). Then a SELECT by email.\n\nA common mistake is CREATE INDEX on a huge table inside a migration at peak traffic.",
      code: `CREATE INDEX CONCURRENTLY students_email_idx
ON students (email);
-- CONCURRENTLY avoids a long write lock
SELECT email FROM students WHERE email = 'ada@test.com';` },
    { id: 92, level: "intermediate", q: "unused indexes?",
      a: "Every INSERT, UPDATE, DELETE must maintain each index. They also use disk. Check statistics to see if an index is never scanned.\n\nDrop only after you know no replica report or nightly job needs it. Be humble: a rare month-end query might need it.\n\nIn the code: DROP INDEX CONCURRENTLY students_old_city_idx. Extra indexes slow writes. Check a replica job before you drop.\n\nA common mistake is dropping an index the nightly report needed.",
      code: `-- after you confirm it is unused:
DROP INDEX CONCURRENTLY students_old_city_idx;
-- extra indexes slow INSERT/UPDATE/DELETE
-- check a replica job before you drop` },
    { id: 93, level: "beginner", q: "SELECT * why avoid?",
      a: "SELECT * pulls every column, including fat TEXT you did not need. When someone adds a column, your app might break or get slower.\n\nCovering indexes cannot help if you asked for every column. Name id, name, email if that is all you show. SELECT * is fine in a quick personal experiment, not in a hot API.\n\nIn the code: SELECT id, name FROM students WHERE city = Pune, not SELECT *.\n\nA common mistake is SELECT * in a list API that only needed two fields.",
      code: `SELECT id, name
FROM students
WHERE city = 'Pune';  -- not SELECT *
-- naming columns keeps payloads small` },
    { id: 94, level: "intermediate", q: "how do you write a many-to-many query?",
      a: "students join enroll on student id, enroll join courses on course id. Filter in WHERE.\n\nIf a student has two courses, they appear twice. That is correct unless you only wanted distinct students. Count with GROUP BY if you need how many courses. Draw the tables on paper first. It becomes easy.\n\nIn the code: s JOIN e ON student_id, JOIN c ON course_id, WHERE s.id = 1.\n\nA common mistake is joining only students to courses with no enroll bridge.",
      code: `SELECT s.name, c.title
FROM students AS s
JOIN enroll AS e ON e.student_id = s.id
JOIN courses AS c ON c.id = e.course_id
WHERE s.id = 1;` },
    { id: 95, level: "intermediate", q: "find duplicates?",
      a: "GROUP BY the key and HAVING COUNT(*) > 1 lists the duplicates. Then you can join back or use ROW_NUMBER to delete extras.\n\nDo this before you add a UNIQUE constraint, or the constraint will fail. Keep one row, the oldest id for example, and delete the rest in a transaction. Always SELECT first, DELETE second.\n\nIn the code: SELECT email, COUNT(*) GROUP BY email HAVING COUNT(*) > 1.\n\nA common mistake is adding UNIQUE(email) before cleaning duplicates.",
      code: `SELECT email, COUNT(*) AS n
FROM users
GROUP BY email
HAVING COUNT(*) > 1;` },
    { id: 96, level: "intermediate", q: "running total?",
      a: "SUM(amount) OVER (PARTITION BY account ORDER BY day) adds as you walk forward. ROWS UNBOUNDED PRECEDING makes the window from the start through this row.\n\nGROUP BY cannot keep every row and the running total at once as nicely. Order must be deterministic. Add id if two rows share a date.\n\nIn the code: running is SUM(amount) OVER PARTITION BY account_id ORDER BY day ROWS UNBOUNDED PRECEDING.\n\nA common mistake is GROUP BY day and losing the per-row amount.",
      code: `SELECT account_id, day, amount,
       SUM(amount) OVER (
         PARTITION BY account_id
         ORDER BY day
         ROWS UNBOUNDED PRECEDING
       ) AS running
FROM movements;` },
    { id: 97, level: "advanced", q: "gaps and islands?",
      a: "Gaps and islands means finding consecutive groups, like streaks of days. A common trick is row numbers minus a date, so a streak shares a group key. Range types are another Postgres tool.\n\nSessionization, user was active then idle then active, is the same family. You do not need a perfect query in 30 seconds. You need the idea: extra numbering to tag clumps. Practice on a tiny calendar table.\n\nIn the code: day minus ROW_NUMBER times 1 day AS island. Same island key means consecutive days in one clump.\n\nA common mistake is trying to solve streaks with only GROUP BY city.",
      code: `SELECT user_id, day,
       day - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY day)) * INTERVAL '1 day' AS island
FROM visits;
-- same island key means consecutive days in one clump` },
    { id: 98, level: "advanced", q: "EXPLAIN said Seq Scan — is that always bad?",
      a: "If you need 80% of a big table, reading it in order can be the cheapest plan. It is bad when a selective WHERE has no useful index, or estimates are wrong.\n\nLook at rows removed versus rows read. Add an index when the filter is selective. ANALYZE if the planner's row guess is wildly off.\n\nIn the code: EXPLAIN ANALYZE SELECT * FROM students WHERE city = Pune. Seq Scan may be fine if almost every student is in Pune.\n\nA common mistake is treating every Seq Scan as a fail.",
      code: `EXPLAIN ANALYZE
SELECT * FROM students WHERE city = 'Pune';
-- Seq Scan may be fine if almost every student is in Pune
-- add an index when the filter is selective` },
    { id: 99, level: "intermediate", q: "GRANT and principle of least privilege?",
      a: "The app role should not be a superuser. A migrator role can ALTER TABLE. The runtime role only needs SELECT, INSERT, UPDATE, DELETE on what it uses.\n\nAvoid DROP for the app user if you can. Leaked app credentials then do less damage. GRANT is DCL. Review it like you review code.\n\nIn the code: GRANT SELECT, INSERT, UPDATE, DELETE ON students TO app_user. No GRANT ALL. REVOKE ALL FROM PUBLIC.\n\nA common mistake is the app connecting as the postgres superuser.",
      code: `GRANT SELECT, INSERT, UPDATE, DELETE ON students TO app_user;
-- no GRANT ALL, no superuser
-- migrator role can ALTER TABLE; app role cannot DROP
REVOKE ALL ON students FROM PUBLIC;` },
    { id: 100, level: "advanced", q: "How do you approach a SQL interview question?",
      a: "Restate the grain: one row per what? Handle NULLs. Pick INNER versus LEFT. Decide GROUP BY versus a window. Then mention indexes for the WHERE and JOIN columns.\n\nWrite readable SQL. The interviewer must follow it. Say assumptions out loud: unique keys, timezone, latest meaning.\n\nIn the code: grain is one row per student. LEFT JOIN enroll, COUNT courses, GROUP BY s.id, s.name.\n\nA common mistake is jumping to SELECT * without saying what a row means.",
      code: `-- grain: one row per student
SELECT s.id, s.name, COUNT(e.course_id) AS courses
FROM students AS s
LEFT JOIN enroll AS e ON e.student_id = s.id
GROUP BY s.id, s.name;` },
  ]
};
