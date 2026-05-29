'use client';

import { useState } from 'react';
import SectionHeading from '@/components/SectionHeading';
import { Search, Info, HelpCircle, Code, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

export default function KeywordsClient() {
  const [search, setSearch] = useState('');
  const [copiedWord, setCopiedWord] = useState(null);

  const keywords = [
    {
      word: 'SELECT',
      category: 'Data Retrieval',
      desc: 'Retrieves rows and columns from one or more database tables.',
      syntax: 'SELECT column1, column2 FROM table_name;',
      example: 'SELECT first_name, salary FROM employees;'
    },
    {
      word: 'INSERT',
      category: 'Data Modification',
      desc: 'Adds new records (rows) to an existing database table.',
      syntax: 'INSERT INTO table_name (col1, col2) VALUES (val1, val2);',
      example: "INSERT INTO departments (dept_name, floor) VALUES ('Marketing', 3);"
    },
    {
      word: 'UPDATE',
      category: 'Data Modification',
      desc: 'Modifies existing columns in table rows matching condition filters.',
      syntax: 'UPDATE table_name SET col1 = val1 WHERE condition;',
      example: "UPDATE employees SET status = 'active' WHERE id = 104;"
    },
    {
      word: 'DELETE',
      category: 'Data Modification',
      desc: 'Removes rows from a table based on a matching filter condition.',
      syntax: 'DELETE FROM table_name WHERE condition;',
      example: 'DELETE FROM session_logs WHERE log_date < NOW() - INTERVAL 30 DAY;'
    },
    {
      word: 'WHERE',
      category: 'Filtering',
      desc: 'Applies boolean logic conditions to filter rows returned by queries.',
      syntax: 'SELECT cols FROM table WHERE logical_condition;',
      example: 'SELECT * FROM products WHERE price > 49.99 AND in_stock = 1;'
    },
    {
      word: 'GROUP BY',
      category: 'Aggregation',
      desc: 'Aggregates subsets of matching rows together into summary groups based on shared column values.',
      syntax: 'SELECT col, aggregate_func(col2) FROM table GROUP BY col;',
      example: 'SELECT country, COUNT(customer_id) FROM customers GROUP BY country;'
    },
    {
      word: 'HAVING',
      category: 'Filtering',
      desc: 'Filters aggregated grouping scopes (behaves like WHERE, but evaluated after GROUP BY aggregations).',
      syntax: 'SELECT col FROM table GROUP BY col HAVING aggregate_condition;',
      example: 'SELECT category, SUM(sales) FROM products GROUP BY category HAVING SUM(sales) > 10000;'
    },
    {
      word: 'ORDER BY',
      category: 'Sorting',
      desc: 'Sorts row output based on one or more columns in ascending (ASC) or descending (DESC) directions.',
      syntax: 'SELECT cols FROM table ORDER BY col [ASC|DESC];',
      example: 'SELECT employee_id, salary FROM employees ORDER BY salary DESC, last_name ASC;'
    },
    {
      word: 'JOIN',
      category: 'Relational Joins',
      desc: 'Combines columns from two database tables using matched relational join key columns.',
      syntax: 'SELECT cols FROM t1 JOIN t2 ON t1.key = t2.key;',
      example: 'SELECT o.order_id, c.customer_name FROM orders o JOIN customers c ON o.cust_id = c.id;'
    },
    {
      word: 'CTE (WITH)',
      category: 'Advanced Querying',
      desc: 'Defines temporary result queries that act like local query scopes, improving multi-join readability.',
      syntax: 'WITH cte_name AS (SELECT cols FROM table) SELECT cols FROM cte_name;',
      example: 'WITH active_users AS (SELECT id FROM users WHERE status = \'active\') SELECT * FROM active_users;'
    },
    {
      word: 'DISTINCT',
      category: 'Filtering',
      desc: 'Eliminates duplicate rows from query results, returning only unique values.',
      syntax: 'SELECT DISTINCT column_name FROM table_name;',
      example: 'SELECT DISTINCT job_title FROM employees;'
    },
    {
      word: 'TRUNCATE',
      category: 'Data Definition',
      desc: 'Empty all row values in a target table instantly. Faster than DELETE as it bypasses triggers.',
      syntax: 'TRUNCATE TABLE table_name;',
      example: 'TRUNCATE TABLE session_caches;'
    }
  ];

  // Filtering
  const filteredKeywords = keywords.filter(item => 
    item.word.toLowerCase().includes(search.toLowerCase()) ||
    item.desc.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopyCode = async (word, codeText) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedWord(word);
      toast.success(`Copied ${word} example!`);
      setTimeout(() => setCopiedWord(null), 2000);
    } catch (err) {
      toast.error('Copy failed.');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in relative w-full">
      
      {/* Global Background Animated Mesh */}
      <div className="absolute top-[-5%] right-[10%] w-[50vw] h-[50vw] max-w-[700px] rounded-full bg-gradient-to-tr from-brand-primary/10 via-amber-500/5 to-transparent blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-[50%] left-[-10%] w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-gradient-to-bl from-brand-purple/10 via-brand-rose/5 to-transparent blur-[120px] pointer-events-none -z-10" style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />

      {/* Title */}
      <div className="relative z-10">
        <SectionHeading
          badge="SQL Glossary"
          title="SQL Keywords Explorer"
          description="Familiarize yourself with SQL keywords. Inspect command structures, study basic syntaxes, and copy simple examples to learn SQL fundamentals."
        />
      </div>

      {/* Control bar: search */}
      <div className="max-w-md mx-auto relative group z-10">
        <Search size={18} className="text-gray-400 group-hover:text-brand-primary transition-colors absolute left-4 top-1/2 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter keywords dictionary (e.g. 'select', 'join', 'dml')..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          suppressHydrationWarning
          className="w-full text-xs font-bold pl-12 pr-4 py-3.5 rounded-2xl border border-dark-border dark:border-white/10 bg-white/40 dark:bg-black/30 backdrop-blur-xl text-gray-700 dark:text-gray-200 outline-none placeholder-gray-500 hover:border-brand-primary/30 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-all shadow-sm"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[90rem] mx-auto relative z-10">
        {filteredKeywords.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-24 text-xs text-gray-500 flex flex-col items-center justify-center gap-3">
            <div className="p-4 rounded-3xl bg-black/5 dark:bg-white/5 border border-dark-border/40 dark:border-white/10">
              <HelpCircle size={36} className="text-gray-400 dark:text-gray-500 animate-pulse" />
            </div>
            <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">No keywords found matching &ldquo;<span className="text-brand-primary">{search}</span>&rdquo;</p>
            <p className="text-[11px] text-gray-400">Try clearing search parameters to view full lists.</p>
          </div>
        ) : (
          filteredKeywords.map((k) => (
            <div
              key={k.word}
              className="relative p-6 rounded-3xl bg-white/40 dark:bg-[#070a10]/60 backdrop-blur-xl border border-dark-border dark:border-white/5 flex flex-col justify-between space-y-4 overflow-hidden group hover:border-brand-primary/30 hover:shadow-[0_0_30px_rgba(20,184,166,0.1)] transition-all"
            >
              <div className="space-y-3 relative z-10">
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dark-border/40 dark:border-white/5 pb-3">
                  <span className="font-mono font-black text-sm sm:text-base tracking-wide text-brand-primary select-all drop-shadow-sm">
                    {k.word}
                  </span>
                  <span className="px-2 py-1 rounded-md text-[8px] font-mono tracking-widest font-black bg-white/60 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-dark-border dark:border-white/10 uppercase shadow-sm">
                    {k.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans pt-1">
                  {k.desc}
                </p>
              </div>

              {/* Syntax & Code examples */}
              <div className="space-y-3 pt-4 relative z-10">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <Info size={12} className="text-gray-400" />
                    <span>Syntax Model</span>
                  </span>
                  <code className="block rounded-xl bg-black/10 dark:bg-black/40 border border-gray-200 dark:border-white/5 p-3 font-mono text-[10px] text-brand-purple truncate shadow-inner">
                    {k.syntax}
                  </code>
                </div>

                <div className="space-y-1.5 relative group/code">
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5 select-none">
                    <Code size={12} className="text-gray-400" />
                    <span>Usage Example</span>
                  </span>
                  <code className="block rounded-xl bg-gray-100 dark:bg-black/60 border border-gray-200 dark:border-white/10 p-3 font-mono text-[10px] text-gray-700 dark:text-gray-300 truncate pr-10 select-all shadow-inner group-hover/code:border-brand-primary/30 transition-colors">
                    {k.example}
                  </code>
                  <button
                    onClick={() => handleCopyCode(k.word, k.example)}
                    suppressHydrationWarning
                    className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-white/80 dark:bg-black/60 text-gray-500 hover:text-white hover:bg-brand-primary border border-gray-200 dark:border-white/10 cursor-pointer shrink-0 transition-all shadow-sm backdrop-blur-md"
                    title="Copy Example"
                  >
                    {copiedWord === k.word ? <Check size={10} className="text-brand-emerald" /> : <Copy size={10} />}
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}
