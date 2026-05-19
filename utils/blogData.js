export const blogPosts = [
  {
    slug: 'sql-best-practices-modern-app-developers',
    title: 'SQL Best Practices for Modern Application Developers',
    description: 'Master the core guidelines of query optimization, indexing strategies, avoiding SELECT * overhead, and constructing reusable Common Table Expressions (CTEs).',
    category: 'Optimization',
    author: 'Elena Rostova',
    authorRole: 'Lead Database Engineer',
    publishedAt: '2026-05-10',
    readingTime: '6 min read',
    tags: ['Performance', 'Indexing', 'PostgreSQL', 'Best Practices'],
    toc: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'indexing-fundamentals', label: '1. Indexing Fundamentals' },
      { id: 'avoiding-select-all', label: '2. Stop Using SELECT *' },
      { id: 'leveraging-ctes', label: '3. Reusable CTEs vs Subqueries' },
      { id: 'conclusion', label: 'Conclusion' }
    ],
    content: `
### Introduction

In modern application development, Object-Relational Mappers (ORMs) like Prisma, Hibernate, or ActiveRecord make it incredibly easy to interact with databases. However, this convenience often hides the underlying queries, resulting in sub-optimal database performance. Understanding raw SQL best practices is crucial for keeping your database fast, responsive, and cost-effective.

---

### 1. Indexing Fundamentals

An index is a structure that allows the database engine to locate records without scanning the entire table. Think of it as a book index rather than flipping through every single page.

- **Primary and Unique Indexes**: Standard lookups like \`WHERE id = 5\` are auto-indexed by primary keys.
- **Foreign Keys**: Always index foreign key columns (e.g. \`tenant_id\`, \`user_id\`) as they are commonly used in \`JOIN\` operations.
- **Composite Indexes**: When querying on multiple columns (e.g. \`WHERE status = 'active' AND created_at > NOW()\`), create a composite index on both columns. The order of columns in the index matters: place the column with the highest filter selectivity (or equality filters) first!

\`\`\`sql
-- Creating an optimized composite index
CREATE INDEX idx_orders_status_date ON orders (status, order_date DESC);
\`\`\`

---

### 2. Stop Using SELECT *

It is tempting to write \`SELECT * FROM users\` during prototyping. But in production, fetching all columns can severely degrade performance.

#### The Cost of SELECT *
1. **Network Overhead**: Transferring useless large columns (like text descriptions, avatar images, or JSON logs) increases network payload size.
2. **Memory Footprint**: The application server must allocate memory to parse and serialize columns that aren't even used in the UI.
3. **Preventing Covered Indexes**: If all required columns are in an index, the database can fetch data directly from the index without doing a secondary lookup on the main table heap. Using \`*\` instantly breaks this optimization.

\`\`\`sql
-- Bad: Pulling entire row structure
SELECT * FROM users WHERE email = 'dev@sqlbeast.dev';

-- Good: Fetching only the exact required columns
SELECT user_id, username, status FROM users WHERE email = 'dev@sqlbeast.dev';
\`\`\`

---

### 3. Reusable CTEs vs Subqueries

Common Table Expressions (CTEs) make your SQL code readable, modular, and easy to debug. They act like local temporary variables/tables within a single query execution.

#### Why Choose CTEs?
- **Readability**: CTEs flow sequentially from top to bottom, making it easy for another developer to understand your logic. Subqueries require reading from the inside out.
- **Optimization (PostgreSQL 12+)**: PostgreSQL allows CTEs to be merged into the main query plan or materialized, giving the database engine great flexibility.

\`\`\`sql
-- modular, highly readable CTE structure
WITH active_users AS (
  SELECT user_id, username 
  FROM users 
  WHERE status = 'active'
),
monthly_purchases AS (
  SELECT user_id, SUM(amount) AS total_spent
  FROM transactions
  WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
  GROUP BY user_id
)
SELECT u.username, COALESCE(p.total_spent, 0) AS monthly_bill
FROM active_users u
LEFT JOIN monthly_purchases p ON u.user_id = p.user_id
ORDER BY monthly_bill DESC;
\`\`\`

---

### Conclusion

Tuning your SQL queries isn't black magic. By applying disciplined indexing, fetching only the required column projections, and wrapping complex procedures in readable CTEs, you can scale your database performance to handle millions of transactions with ease. Happy querying!
`
  },
  {
    slug: 'why-you-should-stop-writing-dangerous-sql-queries',
    title: 'How to Prevent Dangerous SQL Queries in Production',
    description: 'Protect your system against catastrophic schema locks, unconstrained DELETE operations, and table truncations by setting up strict safety controls.',
    category: 'Security',
    author: 'Marcus Vance',
    authorRole: 'Principal Security Analyst',
    publishedAt: '2026-05-14',
    readingTime: '5 min read',
    tags: ['Security', 'Database Safety', 'DDL', 'Operations'],
    toc: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'anatomy-of-disaster', label: '1. The Anatomy of Disasters' },
      { id: 'dangerous-ddl', label: '2. Catastrophic DDL Locks' },
      { id: 'mitigation-strategies', label: '3. Mitigation & Protection' },
      { id: 'conclusion', label: 'Conclusion' }
    ],
    content: `
### Introduction

We have all heard the horror stories: an engineer opens a production database console, intends to run a quick test, and accidentally deletes millions of records or drops an active transactional table. These events are almost always preventable. Let's analyze what makes a query dangerous, and how we can shield our databases from fatal user errors.

---

### 1. The Anatomy of Disasters

The two most common human-triggered SQL disasters are:
1. **Unconstrained DELETE**: Executing a delete command without a \`WHERE\` filter, causing a complete table wipeout.
2. **TRUNCATE**: Similar to delete, but instant and non-logged in some configurations, bypassing standard row triggers.

\`\`\`sql
-- THE NIGHTMARE
DELETE FROM client_ledgers;
-- Executing this will instantly delete every single invoice in your company.
\`\`\`

#### Why does this happen?
Many developers test queries in formatting tools, copy a draft, and paste it directly into an active console before appending filter parameters. Implementing warning tools, like **SQL Beast's Dangerous Query Detector**, helps capture these omissions before execution.

---

### 2. Catastrophic DDL Locks

Database safety is not just about keeping rows intact; it is also about keeping the database *accessible*. Running DDL (Data Definition Language) queries on heavy, active production tables can lock the entire schema, resulting in an immediate application outage.

- **ALTER TABLE ADD COLUMN**: Adding a column with a default value in older database versions forces the engine to rewrite every single block on the disk. This locks the table against reads and writes.
- **DROP TABLE**: Dropping a table locks the system catalog. If other queries are waiting in line, they will queue up and consume all available connection pools, bringing the app down.

\`\`\`sql
-- Dangerous schema lock on a table with 10M rows:
ALTER TABLE transactions ADD COLUMN status VARCHAR(20) DEFAULT 'pending' NOT NULL;
-- Safer approach in Postgres: add nullable, then add default concurrently, then validate.
\`\`\`

---

### 3. Mitigation & Protection

To safeguard production data:
1. **Use Transaction Blocks**: Always run writes inside a transaction block and audit the affected rows before committing!
   \`\`\`sql
   BEGIN TRANSACTION;
   DELETE FROM client_ledgers WHERE ledger_id = 45;
   -- Check: SELECT count(*) FROM client_ledgers;
   -- If count looks correct:
   COMMIT;
   -- If count shows 0 rows:
   ROLLBACK;
   \`\`\`
2. **Restrict Privileges**: Application accounts should never run DDL or DELETE/DROP operations. Implement Least Privilege Principle.
3. **Automate Query Guardrails**: Integrate syntax linters in your deployment CI/CD to block deployments that contain direct \`DROP TABLE\` or \`TRUNCATE\` scripts without DBA approvals.

---

### Conclusion

Database safety is a combination of engineering discipline, sensible permissions, and automated tooling. By adopting secure transactions and using validator tools, you can completely eliminate "accidental deletion" events from your engineering logs.
`
  },
  {
    slug: 'deep-dive-sql-join-algorithms-explained',
    title: 'Under the Hood: Deep Dive into SQL Join Algorithms',
    description: 'Learn how modern query optimizers choose between Nested Loops, Hash Joins, and Sort-Merge Joins to combine your relational datasets.',
    category: 'Architecture',
    author: 'Dr. Sarah Chen',
    authorRole: 'DB Engine Architect',
    publishedAt: '2026-05-17',
    readingTime: '8 min read',
    tags: ['Database Internals', 'Algorithms', 'Optimization', 'Engines'],
    toc: [
      { id: 'introduction', label: 'Introduction' },
      { id: 'nested-loop', label: '1. Nested Loop Join' },
      { id: 'hash-join', label: '2. Hash Join' },
      { id: 'sort-merge', label: '3. Sort-Merge Join' },
      { id: 'optimizer-choice', label: 'How the Optimizer Chooses' },
      { id: 'conclusion', label: 'Conclusion' }
    ],
    content: `
### Introduction

Relational databases represent datasets in separate tables. When you query \`SELECT * FROM orders JOIN customers\`, the database engine must execute an algorithmic join. But how does it do this? Behind the scenes, the query optimizer evaluates the sizes of both tables, index structures, and filter criteria to select one of three main join algorithms. Let's study how they work under the hood.

---

### 1. Nested Loop Join

The simplest join strategy. For each outer row, the database scans the inner table to find matches.

#### Algorithmic Flow
\`\`\`javascript
for (let outerRow of outerTable) {
  for (let innerRow of innerTable) {
    if (matchCondition(outerRow, innerRow)) {
      outputJoinResult(outerRow, innerRow);
    }
  }
}
\`\`\`

- **Time Complexity**: $O(N \times M)$ if both tables are unindexed, which is highly inefficient.
- **When is it used?**:
  - One table is extremely small (e.g. 5 rows) and the other is indexed.
  - The lookup column on the inner table is indexed ($O(N \log M)$ complexity). The database performs a quick B-Tree index lookup for every outer row.

---

### 2. Hash Join

The workhorse of modern analytical databases. When tables are massive and not pre-sorted, a Hash Join is extremely efficient.

#### Algorithmic Flow
1. **Build Phase**: The engine reads the smaller table (Build Input) and hashes the join key columns into an in-memory hash table.
2. **Probe Phase**: The engine scans the larger table (Probe Input) and hashes its join key. It immediately checks the in-memory hash table for matching slots.

- **Time Complexity**: $O(N + M)$ - linear time!
- **When is it used?**: Joining massive, unsorted datasets when no indexes are present.
- **Drawback**: Requires sufficient RAM to hold the hash table. If the hash table exceeds memory limits, it overflows to disk (tempdb/workfile spills), which slows it down.

---

### 3. Sort-Merge Join

A classic divide-and-conquer strategy that is highly efficient when the inputs are already sorted, or if the join condition is an inequality (e.g. \`a.value < b.value\`).

#### Algorithmic Flow
1. **Sort Phase**: Sort both datasets by their join key columns (unless they are already pre-sorted by an index scan).
2. **Merge Phase**: Maintain two pointers at the start of both tables. Move them forward in sync, outputting matches whenever the keys line up.

- **Time Complexity**: $O(N \log N + M \log M)$ due to sorting. If already sorted, it is $O(N + M)$.
- **When is it used?**:
  - When tables are already sorted by their primary keys or index keys.
  - For range joins/inequalities.

---

### How the Optimizer Chooses

Modern SQL engine optimizers calculate the **Cost-Based Plan** by checking table statistics:

| Parameter | Nested Loop | Hash Join | Sort-Merge |
| :--- | :--- | :--- | :--- |
| **Best Dataset Size** | Small (with index) | Medium to Large | Very Large |
| **Index Required?** | Highly recommended | No index required | Ideal if sorted by index |
| **Memory Usage** | Minimal ($O(1)$) | High ($O(\text{Build Table})$) | Moderate (unless sorting) |
| **Equality Only?** | Works with any | Equality only (\`=\`) | Works with inequalities (\`<\`, \`>\`) |

---

### Conclusion

Understanding join algorithms explains why indexes on foreign keys are so important. Without them, your engine is forced to default to expensive, high-memory Hash Joins or brute-force Nested Loops. By structuring tables cleanly and indexing search paths, you enable the optimizer to run blazing fast joins in milliseconds.
`
  }
];
