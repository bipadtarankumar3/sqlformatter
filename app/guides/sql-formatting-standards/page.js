import Link from 'next/link';
import { BookOpen, Clock, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'SQL Formatting Standards & Best Practices',
  description: 'Master industry-standard SQL query formatting. Learn when to use uppercase keywords, how to indent nested joins, and write readable database queries.',
  alternates: {
    canonical: 'https://sqlbeast.dev/guides/sql-formatting-standards',
  },
};

export default function SqlStandardsGuide() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 text-gray-800 dark:text-gray-200">
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline uppercase"
      >
        <ArrowLeft size={16} /> Back to Tools
      </Link>

      <article className="space-y-6">
        <header className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider border border-indigo-200 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 uppercase">
            Database Standards
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
            SQL Formatting Standards & Best Practices
          </h1>
          <div className="flex items-center gap-4 text-xs opacity-50 font-bold uppercase">
            <span className="flex items-center gap-1"><BookOpen size={14} /> 5 Min Read</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={14} /> Published 2026</span>
          </div>
        </header>

        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 dark:border-white/5 space-y-6 leading-relaxed">
          <h2 className="text-xl font-bold uppercase text-indigo-600 dark:text-indigo-400">Why SQL Formatting Matters</h2>
          <p>
            SQL is a declarative language, meaning it details *what* data to retrieve rather than *how* to fetch it. While database engines parse compact, single-line queries with ease, human developers require structured layouts to audit logic, locate joins, and perform optimization.
          </p>

          <h2 className="text-xl font-bold uppercase text-indigo-600 dark:text-indigo-400">Rule 1: Capitalize All Keywords</h2>
          <p>
            Always capitalize SQL keywords (`SELECT`, `FROM`, `WHERE`, `JOIN`, `GROUP BY`, `ORDER BY`, `AND`, `OR`). Keep tables, columns, and aliases in lowercase or camelCase:
          </p>
          <pre className="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl font-mono text-xs overflow-x-auto text-indigo-700 dark:text-indigo-300">
{`-- Bad Form
select id, username from users where status = 'active';

-- Standard Form
SELECT id, username 
FROM users 
WHERE status = 'active';`}
          </pre>

          <h2 className="text-xl font-bold uppercase text-indigo-600 dark:text-indigo-400">Rule 2: Indent Joins and Nesting</h2>
          <p>
            Place each join on a new line and align the `ON` condition. Indent nested subqueries or CTEs (Common Table Expressions) by 2 or 4 spaces:
          </p>
          <pre className="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl font-mono text-xs overflow-x-auto text-indigo-700 dark:text-indigo-300">
{`WITH active_orders AS (
  SELECT user_id, SUM(amount) as total
  FROM orders
  WHERE status = 'completed'
  GROUP BY user_id
)
SELECT u.username, o.total
FROM users u
JOIN active_orders o ON u.id = o.user_id;`}
          </pre>

          <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col items-center">
            <Link 
              href="/formatter" 
              className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs tracking-widest uppercase transition-all shadow-lg hover:-translate-y-0.5"
            >
              Launch SQL Formatter →
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
