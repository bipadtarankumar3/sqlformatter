import Link from 'next/link';
import { BookOpen, Clock, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'How to Prevent SQL Injection Attacks',
  description: 'Learn the principles of SQL injection (SQLi) prevention. Understand parametrized queries, prepared statements, and input sanitation best practices.',
  alternates: {
    canonical: 'https://sqlformatter.revoxera.com/guides/preventing-sql-injection',
  },
};

export default function SqlInjectionGuide() {
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
          <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black tracking-wider border border-rose-200 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 uppercase">
            Database Security
          </span>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white uppercase">
            How to Prevent SQL Injection (SQLi)
          </h1>
          <div className="flex items-center gap-4 text-xs opacity-50 font-bold uppercase">
            <span className="flex items-center gap-1"><BookOpen size={14} /> 6 Min Read</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock size={14} /> Published 2026</span>
          </div>
        </header>

        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-gray-100 dark:border-white/5 space-y-6 leading-relaxed">
          <h2 className="text-xl font-bold uppercase text-rose-600 dark:text-rose-400">What is SQL Injection?</h2>
          <p>
            SQL Injection (SQLi) is a vulnerability where an attacker injects malicious SQL statements into input fields or parameters, manipulating the query execution database logic. This allows unauthorized access to retrieve, mutate, or destroy system data.
          </p>

          <h2 className="text-xl font-bold uppercase text-indigo-600 dark:text-indigo-400">Prevention 1: Prepared Statements (Parametrization)</h2>
          <p>
            The primary defense against SQLi is prepared statements. Prepared statements separate the query template from input arguments, forcing the database parser to treat variables as literal values rather than execution code.
          </p>
          <pre className="bg-gray-100 dark:bg-slate-800 p-4 rounded-xl font-mono text-xs overflow-x-auto text-rose-700 dark:text-rose-300">
{`// Vulnerable Node.js Node-Postgres Code
const query = \`SELECT * FROM users WHERE email = '\${req.body.email}'\`;
await db.query(query); // High Risk!

// Secured Code (Parametrized)
const query = 'SELECT * FROM users WHERE email = $1';
await db.query(query, [req.body.email]); // Secure`}
          </pre>

          <h2 className="text-xl font-bold uppercase text-indigo-600 dark:text-indigo-400">Prevention 2: Input Sanitation & Escaping</h2>
          <p>
            Always validate and sanitize input against strict schemas (e.g. using Zod or Joi). Escape special string qualifiers like single quotes if dynamic formatting is unavoidable.
          </p>

          <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex flex-col items-center">
            <Link 
              href="/validator" 
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs tracking-widest uppercase transition-all shadow-lg hover:-translate-y-0.5"
            >
              Launch SQL Validator →
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
