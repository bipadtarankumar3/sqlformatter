'use client';

import { useState } from 'react';
import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { exampleQueries } from '@/utils/exampleQueries';
import { ArrowRight, Copy, Check, FileCode, Terminal } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExamplesClient() {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCode = async (id, codeText) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedId(id);
      toast.success('Query copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Copy failed.');
    }
  };

  return (
    <div className="space-y-12 animate-fade-in relative w-full">
      
      {/* Global Background Animated Mesh */}
      <div className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[700px] rounded-full bg-gradient-to-tr from-brand-primary/10 via-brand-purple/5 to-transparent blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-[40%] left-[-10%] w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-gradient-to-br from-brand-emerald/10 via-blue-500/5 to-transparent blur-[120px] pointer-events-none -z-10" style={{ animation: 'pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />

      {/* Title */}
      <div className="relative z-10">
        <SectionHeading
          badge="Query Library"
          title="SQL Dialect Templates Gallery"
          description="Select a pre-designed query block matching PostgreSQL CTEs, MySQL aggregations, or SQLite schemas. Load it immediately into the formatter or copy to test locally."
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[90rem] mx-auto relative z-10">
        {exampleQueries.map((eq) => (
          <div
            key={eq.id}
            className="relative p-6 rounded-3xl bg-white/40 dark:bg-[#070a10]/60 backdrop-blur-xl border border-dark-border dark:border-white/5 flex flex-col justify-between space-y-4 overflow-hidden group hover:border-brand-primary/30 hover:shadow-[0_0_30px_rgba(20,184,166,0.1)] transition-all"
          >
            <div className="space-y-3 relative z-10">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dark-border/40 dark:border-white/5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary/20 transition-colors">
                    <FileCode size={16} className="transform group-hover:rotate-12 transition-transform" />
                  </div>
                  <h3 className="font-sans font-extrabold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors tracking-tight">
                    {eq.name}
                  </h3>
                </div>
                <span className="px-2 py-1 rounded-md text-[8px] font-mono tracking-widest font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20 uppercase shadow-sm">
                  {eq.dialect}
                </span>
              </div>

              {/* Description */}
              <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans pt-1">
                {eq.description}
              </p>
            </div>

            {/* Code Block preview */}
            <div className="relative z-10 rounded-2xl overflow-hidden border border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/40 p-4 select-all font-mono text-[11px] sm:text-xs text-gray-800 dark:text-gray-300 whitespace-pre overflow-x-auto leading-relaxed max-h-[140px] custom-scrollbar shadow-inner group-hover:border-brand-primary/20 transition-colors">
              {eq.sql}
              <button
                onClick={() => handleCopyCode(eq.id, eq.sql)}
                suppressHydrationWarning
                className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-white/80 dark:bg-black/60 hover:bg-brand-primary hover:text-white text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-white/10 cursor-pointer shrink-0 transition-all shadow-sm backdrop-blur-md"
                title="Copy Code"
              >
                {copiedId === eq.id ? <Check size={12} className="text-brand-emerald" /> : <Copy size={12} />}
              </button>
            </div>

            {/* Actions */}
            <div className="relative z-10 flex items-center gap-2 pt-4 mt-2 border-t border-dark-border/40 dark:border-white/5">
              <Link
                href={`/formatter?load=${eq.id}`}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-[11px] font-black tracking-wider uppercase text-white bg-gradient-to-r from-brand-primary to-brand-purple hover:brightness-110 shadow-lg shadow-brand-primary/20 transition-all cursor-pointer scale-100 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Terminal size={14} />
                Load in Formatter
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
