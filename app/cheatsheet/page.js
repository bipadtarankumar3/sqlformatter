'use client';

import { useState } from 'react';
import SectionHeading from '@/components/SectionHeading';
import AnimatedButton from '@/components/AnimatedButton';
import { Search, Copy, Check, Terminal, Database, Layers, ArrowRightLeft, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheatSheet() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState(null);

  const categories = [
    'All',
    'Basics',
    'Data Definition (DDL)',
    'Data Modification (DML)',
    'Joins',
    'Grouping',
    'Advanced (CTE/Window)',
    'Indexes',
    'Transactions'
  ];

  const cheats = [
    // Basics
    {
      id: 'select-all',
      category: 'Basics',
      title: 'SELECT All Columns',
      desc: 'Retrieves all available fields and rows from a target database table.',
      code: 'SELECT * FROM employees;',
      dialect: 'Standard'
    },
    {
      id: 'select-selective',
      category: 'Basics',
      title: 'SELECT Specific Columns',
      desc: 'Retrieves only specified projections from the table, minimizing network load.',
      code: 'SELECT employee_id, first_name, salary FROM employees;',
      dialect: 'Standard'
    },
    {
      id: 'where-filter',
      category: 'Basics',
      title: 'Filter with WHERE',
      desc: 'Filters row returns matching a specific logical condition.',
      code: "SELECT * FROM employees WHERE salary > 75000 AND department = 'Engineering';",
      dialect: 'Standard'
    },
    // DDL
    {
      id: 'create-table',
      category: 'Data Definition (DDL)',
      title: 'Create Table',
      desc: 'Establishes a new database relation with structured fields and constraint checks.',
      code: `CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) CHECK (email LIKE '%@%'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
      dialect: 'PostgreSQL'
    },
    {
      id: 'alter-table',
      category: 'Data Definition (DDL)',
      title: 'Add Column',
      desc: 'Mutates an existing schema structure to append a new nullable data field.',
      code: 'ALTER TABLE users ADD COLUMN last_login TIMESTAMP;',
      dialect: 'Standard'
    },
    {
      id: 'drop-table',
      category: 'Data Definition (DDL)',
      title: 'Drop Table',
      desc: 'Destroys an active database table along with all its recorded indexes and rows.',
      code: 'DROP TABLE IF EXISTS archived_users;',
      dialect: 'Standard'
    },
    // DML
    {
      id: 'insert-row',
      category: 'Data Modification (DML)',
      title: 'Insert Record',
      desc: 'Appends a new structured row values entry into a target relation.',
      code: "INSERT INTO users (username, email) VALUES ('octocat', 'git@github.com');",
      dialect: 'Standard'
    },
    {
      id: 'update-row',
      category: 'Data Modification (DML)',
      title: 'Update Record',
      desc: 'Modifies active fields in records matching a filtering index condition. WARNING: Always use WHERE!',
      code: "UPDATE users SET status = 'active' WHERE user_id = 42;",
      dialect: 'Standard'
    },
    {
      id: 'delete-row',
      category: 'Data Modification (DML)',
      title: 'Delete Record',
      desc: 'Safely removes row objects matching criteria from the relation. WARNING: Always use WHERE!',
      code: 'DELETE FROM users WHERE last_login < NOW() - INTERVAL 1 YEAR;',
      dialect: 'Standard'
    },
    // Joins
    {
      id: 'inner-join',
      category: 'Joins',
      title: 'INNER JOIN',
      desc: 'Combines two tables, returning rows only where the join key matches in both tables.',
      code: `SELECT orders.order_id, customers.company_name
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;`,
      dialect: 'Standard'
    },
    {
      id: 'left-join',
      category: 'Joins',
      title: 'LEFT OUTER JOIN',
      desc: 'Returns all rows from the left table, and matching rows from the right table. Fills NULLs if unmatched.',
      code: `SELECT employees.last_name, departments.dept_name
FROM employees
LEFT JOIN departments ON employees.dept_id = departments.id;`,
      dialect: 'Standard'
    },
    // Grouping
    {
      id: 'group-by',
      category: 'Grouping',
      title: 'GROUP BY & COUNT',
      desc: 'Aggregates matching records together and performs arithmetic counting calculations.',
      code: `SELECT department, COUNT(employee_id) AS total_staff
FROM employees
GROUP BY department
ORDER BY total_staff DESC;`,
      dialect: 'Standard'
    },
    {
      id: 'group-having',
      category: 'Grouping',
      title: 'Filter Aggregates with HAVING',
      desc: 'Filters aggregated grouping scopes (WHERE executes before aggregations, HAVING executes after).',
      code: `SELECT department, AVG(salary) AS avg_sal
FROM employees
GROUP BY department
HAVING AVG(salary) > 85000;`,
      dialect: 'Standard'
    },
    // Advanced
    {
      id: 'cte-statement',
      category: 'Advanced (CTE/Window)',
      title: 'Common Table Expressions (CTE)',
      desc: 'Encapsulates complex intermediate subqueries into readable sequential scopes.',
      code: `WITH regional_sales AS (
  SELECT region, SUM(amount) AS total_sales
  FROM orders
  GROUP BY region
)
SELECT region, total_sales
FROM regional_sales
WHERE total_sales > 50000;`,
      dialect: 'Standard'
    },
    {
      id: 'window-rank',
      category: 'Advanced (CTE/Window)',
      title: 'Window Function: ROW_NUMBER()',
      desc: 'Assigns ranks sequentially to partitioned subsets without collapsing matching rows.',
      code: `SELECT employee_id, salary, department,
       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS rank_in_dept
FROM employees;`,
      dialect: 'PostgreSQL'
    },
    // Indexes
    {
      id: 'create-index',
      category: 'Indexes',
      title: 'Create Standard Index',
      desc: 'Constructs a B-Tree search index to accelerate lookups on high-selectivity columns.',
      code: 'CREATE INDEX idx_users_email ON users (email);',
      dialect: 'Standard'
    },
    {
      id: 'composite-index',
      category: 'Indexes',
      title: 'Create Composite Index',
      desc: 'Establishes a single multi-column index. Ideal for composite equality filter parameters.',
      code: 'CREATE INDEX idx_orders_status_date ON orders (status, order_date DESC);',
      dialect: 'Standard'
    },
    // Transactions
    {
      id: 'txn-blocks',
      category: 'Transactions',
      title: 'Transaction Block (ACID)',
      desc: 'Ensures relational execution sequences either fully complete or safely rollback together.',
      code: `BEGIN TRANSACTION;
  UPDATE accounts SET balance = balance - 100 WHERE account_id = 1;
  UPDATE accounts SET balance = balance + 100 WHERE account_id = 2;
COMMIT;`,
      dialect: 'Standard'
    }
  ];

  // Filtering Logic
  const filteredCheats = cheats.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.desc.toLowerCase().includes(search.toLowerCase()) ||
                          item.code.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCopyCode = async (id, codeText) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedId(id);
      toast.success('Snippet copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Copy failed.');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in relative w-full">
      
      {/* Global Background Animated Mesh */}
      <div className="absolute top-[-5%] left-[-10%] w-[50vw] h-[50vw] max-w-[700px] rounded-full bg-gradient-to-tr from-brand-primary/10 via-blue-500/5 to-transparent blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-gradient-to-bl from-brand-purple/10 via-teal-500/5 to-transparent blur-[120px] pointer-events-none -z-10" style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />

      {/* Title */}
      <div className="relative z-10">
        <SectionHeading
          badge="Syntax Manual"
          title="SQL Cheat Sheet Index"
          description="Browse through categorized templates covering standard SQL syntax. Copy snippets, check dialect optimizations, or study CTE and transaction structures."
        />
      </div>

      {/* Control bar: search & category slider */}
      <div className="space-y-6 relative z-10">
        
        {/* Search */}
        <div className="max-w-md mx-auto relative group">
          <Search size={18} className="text-gray-400 group-hover:text-brand-primary transition-colors absolute left-4 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search syntax (e.g. 'join', 'index', 'having')..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-bold pl-12 pr-4 py-3.5 rounded-2xl border border-dark-border dark:border-white/10 bg-white/40 dark:bg-black/30 backdrop-blur-xl text-gray-700 dark:text-gray-200 outline-none placeholder-gray-500 hover:border-brand-primary/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all shadow-sm"
          />
        </div>

        {/* Category sliding pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-brand-primary text-white border-brand-primary shadow-[0_0_15px_rgba(20,184,166,0.4)] scale-105'
                  : 'bg-white/40 dark:bg-black/20 text-gray-500 border-transparent hover:bg-white/60 dark:hover:bg-white/5 dark:text-gray-300 hover:border-brand-primary/20 hover:scale-105'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Cheats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[90rem] mx-auto relative z-10">
        {filteredCheats.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-24 text-xs text-gray-500 flex flex-col items-center justify-center gap-3">
            <div className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-dark-border/40 dark:border-white/10">
              <BookOpen size={36} className="text-gray-400 dark:text-gray-500 animate-pulse" />
            </div>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">No cheat sheets found for your query.</p>
            <p className="text-[11px] text-gray-400">Try clearing search words or changing category scopes.</p>
          </div>
        ) : (
          filteredCheats.map((c) => (
            <div
              key={c.id}
              className="relative p-6 rounded-3xl bg-white/40 dark:bg-[#070a10]/60 backdrop-blur-xl border border-dark-border dark:border-white/5 flex flex-col justify-between space-y-4 overflow-hidden group hover:border-brand-primary/30 hover:shadow-[0_0_30px_rgba(20,184,166,0.1)] transition-all"
            >
              <div className="space-y-3 relative z-10">
                {/* Title & Badge */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-sans font-extrabold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors tracking-tight">
                    {c.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <span className="px-2 py-1 rounded-md text-[8px] font-mono font-bold bg-white/60 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-dark-border dark:border-white/10 uppercase">
                      {c.dialect}
                    </span>
                    <span className="px-2 py-1 rounded-md text-[8px] font-mono font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase">
                      {c.category}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
                  {c.desc}
                </p>
              </div>

              {/* Code display */}
              <div className="relative z-10 rounded-2xl overflow-hidden border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 p-4 select-all font-mono text-[11px] sm:text-xs text-gray-800 dark:text-gray-300 whitespace-pre leading-relaxed max-h-[160px] overflow-y-auto custom-scrollbar shadow-inner group-hover:border-brand-primary/20 transition-colors">
                {c.code}
                <button
                  onClick={() => handleCopyCode(c.id, c.code)}
                  className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-white/80 dark:bg-black/60 hover:bg-brand-primary hover:text-white text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 cursor-pointer shrink-0 transition-all shadow-sm backdrop-blur-md"
                  title="Copy Snippet"
                >
                  {copiedId === c.id ? <Check size={12} className="text-brand-emerald" /> : <Copy size={12} />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
