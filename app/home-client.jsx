'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Terminal, ShieldCheck, Zap, Key, History,
  Sparkles, Layers, CheckSquare, ShieldAlert, ArrowUpRight, ChevronDown
} from 'lucide-react';
import { useState } from 'react';
import FormatterWidget from '@/components/FormatterWidget';

/* ── data ──────────────────────────────────────────────────── */
const tools = [
  {
    title: 'SQL Formatter & Beautifier',
    description: 'Format nested joins, window functions, and SELECT statements in seconds. Pick indent style, casing, and dialect.',
    path: '/formatter',
    icon: Terminal,
    badge: 'POPULAR',
    features: ['Auto-Format', 'Side-by-Side', 'Preset Queries'],
    glassBg: 'rgba(99,102,241,0.08)',
    border: 'rgba(99,102,241,0.25)',
    orb: '#6366f1',
    iconFrom: '#6366f1',
    iconTo: '#8b5cf6',
    badgeColor: '#6366f1',
  },
  {
    title: 'SQL Minifier & Compressor',
    description: 'Condense heavy queries into single lines by stripping excess whitespace and comment blocks for deployments.',
    path: '/minifier',
    icon: Layers,
    features: ['Whitespace Strip', 'Ratio Tracker', 'Line Splicing'],
    glassBg: 'rgba(16,185,129,0.08)',
    border: 'rgba(16,185,129,0.25)',
    orb: '#10b981',
    iconFrom: '#10b981',
    iconTo: '#06b6d4',
    badgeColor: '#10b981',
  },
  {
    title: 'SQL Validator & Safety Shield',
    description: 'Check syntax integrity in-browser. Detect unclosed brackets or dangerous DROP/DELETE actions instantly.',
    path: '/validator',
    icon: ShieldAlert,
    badge: 'SECURITY',
    features: ['Parentheses Match', 'Unsafe Shield', 'Syntax Alerts'],
    glassBg: 'rgba(244,63,94,0.08)',
    border: 'rgba(244,63,94,0.25)',
    orb: '#f43f5e',
    iconFrom: '#f43f5e',
    iconTo: '#ec4899',
    badgeColor: '#f43f5e',
  },
  {
    title: 'SQL Query Analyzer',
    description: 'Deep-scan analytics: discover joined tables, column counts, nested subqueries, and index optimisations.',
    path: '/analyzer',
    icon: Sparkles,
    features: ['Join Counter', 'Metric Audit', 'Performance Tips'],
    glassBg: 'rgba(245,158,11,0.08)',
    border: 'rgba(245,158,11,0.25)',
    orb: '#f59e0b',
    iconFrom: '#f59e0b',
    iconTo: '#f97316',
    badgeColor: '#f59e0b',
  },
];

const features = [
  { title: 'Auto Formatting',           description: 'Formats your SQL instantly as you paste or type, keeping your editing pipeline fast.',             icon: Zap,        from: '#f59e0b', to: '#f97316' },
  { title: 'Dangerous Query Protection',description: 'Flags DROP or DELETE without WHERE filters to prevent server disasters automatically.',              icon: ShieldAlert, from: '#f43f5e', to: '#ec4899' },
  { title: '100% Client-Side',          description: 'All parsing and beautification run in-browser. Your data never leaves your machine.',               icon: ShieldCheck, from: '#10b981', to: '#06b6d4' },
  { title: 'History Backups',           description: 'Saves your last 20 queries in local storage so you can restore any playground session.',             icon: History,    from: '#8b5cf6', to: '#6366f1' },
  { title: 'Command Palette',           description: 'Press Ctrl+K from anywhere to search cheat sheets, load templates, or run actions instantly.',      icon: Key,        from: '#3b82f6', to: '#06b6d4' },
  { title: 'Dialect Presets',           description: 'Custom formatting rules for Oracle, Postgres, MySQL, SQLite, and Microsoft SQL Server.',            icon: CheckSquare, from: '#14b8a6', to: '#10b981' },
];

const dialects = [
  { name: 'PostgreSQL', label: 'PG', from: '#6366f1', to: '#8b5cf6' },
  { name: 'MySQL',      label: 'MY', from: '#10b981', to: '#06b6d4' },
  { name: 'SQLite',     label: 'SL', from: '#3b82f6', to: '#6366f1' },
  { name: 'SQL Server', label: 'SS', from: '#f43f5e', to: '#ec4899' },
  { name: 'MariaDB',    label: 'MD', from: '#f59e0b', to: '#f97316' },
  { name: 'Oracle SQL', label: 'OR', from: '#ec4899', to: '#f43f5e' },
];

const faqs = [
  { question: 'Is my SQL query secure? Does SQL Beast store my data?',   answer: 'Absolutely not. All parsing, beautifying, and scanning are performed strictly on the client side inside your local browser sandbox. Your queries never touch our servers.' },
  { question: 'How does the Dangerous Query Shield work?',               answer: 'Our validator scans SQL text using localized patterns to find DELETE FROM or UPDATE without a WHERE keyword, or direct DROP/TRUNCATE statements, then shows high-visibility warnings before you copy.' },
  { question: 'Which SQL dialects are supported?',                       answer: 'Standard SQL, PostgreSQL, MySQL, SQLite, MariaDB, Oracle SQL (PL/SQL), and Microsoft SQL Server (T-SQL) through specialized formatting engines.' },
  { question: 'Can I save my favourite queries?',                        answer: 'Yes! Our state manager lets you save SQL queries to Favourites, cached in local storage so they remain available whenever you revisit from the same device.' },
];

/* ── card components ────────────────────────────────────────── */
function ToolCard({ tool, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative flex flex-col rounded-3xl overflow-hidden border shadow-lg transition-all duration-300"
      style={{
        background: tool.glassBg,
        borderColor: tool.border,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* hover orb */}
      <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full blur-[80px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
        style={{ background: tool.orb }} />

      <div className="relative z-10 p-8 sm:p-10 flex flex-col gap-6 h-full">
        {/* badge */}
        {tool.badge && (
          <span className="absolute top-5 right-5 px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase border text-white"
            style={{ background: tool.badgeColor, borderColor: tool.badgeColor }}>
            {tool.badge}
          </span>
        )}

        {/* icon + title */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl shadow-md shrink-0"
            style={{ background: `linear-gradient(135deg,${tool.iconFrom},${tool.iconTo})` }}>
            <tool.icon size={20} className="text-white" />
          </div>
          <h3 className="font-extrabold text-base sm:text-lg leading-tight tracking-tight text-gray-800">
            {tool.title}
          </h3>
        </div>

        {/* description */}
        <p className="text-xs sm:text-sm leading-relaxed text-gray-500 group-hover:text-gray-600 transition-colors">
          {tool.description}
        </p>

        {/* feature pills */}
        <div className="flex flex-wrap gap-2">
          {tool.features.map((f) => (
            <span key={f} className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold tracking-wider border text-gray-500"
              style={{ borderColor: tool.border, background: 'rgba(255,255,255,0.5)' }}>
              {f}
            </span>
          ))}
        </div>

        {/* cta */}
        <div className="mt-auto pt-4 border-t" style={{ borderColor: tool.border }}>
          <Link href={tool.path}
            className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider transition-colors duration-300"
            style={{ color: tool.iconFrom }}>
            Launch Utility
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function FeatureCard({ feat, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="group relative p-8 sm:p-9 rounded-3xl border shadow-md overflow-hidden transition-all duration-300"
      style={{
        background: `linear-gradient(135deg, ${feat.from}0d, ${feat.to}06)`,
        borderColor: `${feat.from}33`,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
      }}
    >
      <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full blur-[50px] opacity-0 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none"
        style={{ background: feat.from }} />

      <div className="relative z-10 flex flex-col gap-5">
        <div className="p-3 rounded-2xl shadow-md w-fit"
          style={{ background: `linear-gradient(135deg,${feat.from},${feat.to})` }}>
          <feat.icon size={20} className="text-white" />
        </div>
        <h3 className="font-extrabold text-base text-gray-800 tracking-tight">{feat.title}</h3>
        <p className="text-xs sm:text-sm leading-relaxed text-gray-500 group-hover:text-gray-600 transition-colors">{feat.description}</p>
      </div>
    </motion.div>
  );
}

function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="rounded-2xl border border-indigo-100 overflow-hidden transition-all duration-200"
      style={{ background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      <button
        onClick={onToggle}
        suppressHydrationWarning
        className="w-full flex items-center justify-between p-6 text-left cursor-pointer select-none"
      >
        <span className="font-bold text-xs sm:text-sm text-gray-700 pr-4">{item.question}</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}
          className="p-1 rounded-lg bg-indigo-50 text-indigo-400 shrink-0">
          <ChevronDown size={14} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }}>
            <div className="px-6 pb-6 pt-2 border-t border-indigo-50 text-xs text-gray-500 leading-relaxed">
              {item.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── page ───────────────────────────────────────────────────── */
export default function HomeClient() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="relative w-full overflow-hidden" style={{ background: 'linear-gradient(160deg,#f8f6ff 0%,#fdf2f8 40%,#f0fdf9 80%,#fffbf0 100%)' }}>

      {/* ambient gradient orbs */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-12%] left-[-8%] w-[50vw] h-[50vw] max-w-[640px] rounded-full blur-[140px] opacity-40"
          style={{ background: 'radial-gradient(circle,#c4b5fd,#a5b4fc,transparent 70%)' }} />
        <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] max-w-[560px] rounded-full blur-[120px] opacity-35"
          style={{ background: 'radial-gradient(circle,#fda4af,#f9a8d4,transparent 70%)' }} />
        <div className="absolute bottom-[5%] left-[12%] w-[38vw] h-[38vw] max-w-[500px] rounded-full blur-[110px] opacity-30"
          style={{ background: 'radial-gradient(circle,#6ee7b7,#a7f3d0,transparent 70%)' }} />
        <div className="absolute top-[55%] left-[42%] w-[28vw] h-[28vw] max-w-[380px] rounded-full blur-[90px] opacity-25"
          style={{ background: 'radial-gradient(circle,#fde68a,#fed7aa,transparent 70%)' }} />
      </div>

      <div className="space-y-16 sm:space-y-24 md:space-y-36 pb-28 px-0 sm:px-2 md:px-4">

        {/* ── 1. FORMATTER WIDGET (FULL WIDTH) ── */}
        <section className="relative pt-4 sm:pt-8 w-full">
          <FormatterWidget hideHeader={false} />
        </section>

        {/* ── 2. DIALECTS ── */}
        <section className="space-y-12">
          <div className="text-center">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Syntax Coverage</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 mt-2">Dialects Supported Out-of-the-Box</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {dialects.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -7, scale: 1.06 }}
                transition={{ duration: 0.25, delay: i * 0.05 }}
                className="group relative flex flex-col items-center justify-center h-28 rounded-2xl border shadow-md overflow-hidden cursor-default transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${d.from}15, ${d.to}08)`,
                  borderColor: `${d.from}30`,
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none rounded-2xl"
                  style={{ background: `radial-gradient(circle, ${d.from}, transparent 70%)` }} />
                <span className="font-black text-2xl mb-0.5 bg-clip-text text-transparent"
                  style={{ backgroundImage: `linear-gradient(135deg,${d.from},${d.to})` }}>
                  {d.label}
                </span>
                <span className="font-mono text-[10px] font-bold text-gray-400 group-hover:text-gray-600 transition-colors text-center px-1">
                  {d.name}
                </span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 3. TOOL CARDS ── */}
        <section className="space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-indigo-200 bg-indigo-50 text-indigo-500">
              Developer Tools
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">Everything you need for SQL</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Format complex queries, minify scripts for production, and validate syntax integrity — no data ever leaves your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {tools.map((tool, i) => <ToolCard key={tool.path} tool={tool} index={i} />)}
          </div>
        </section>

        {/* ── 4. FEATURES ── */}
        <section className="space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-emerald-200 bg-emerald-50 text-emerald-600">
              Product Features
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">Built by Developers, for Developers</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Fast local operations, keyboard shortcuts, history caching, and a polished UI — the tool suite we always wanted.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feat, i) => <FeatureCard key={feat.title} feat={feat} index={i} />)}
          </div>
        </section>

        {/* ── 5. FAQs ── */}
        <section className="space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide border border-rose-200 bg-rose-50 text-rose-500">
              FAQs
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              Questions about security, offline capabilities, or dialect support? We have answers.
            </p>
          </div>
          <div className="w-full max-w-4xl mx-auto space-y-4">
            {faqs.map((item, i) => (
              <FAQItem
                key={i} item={item} index={i}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
