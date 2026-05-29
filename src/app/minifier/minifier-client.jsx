'use client';

import { useState, useEffect } from 'react';
import { minifySql } from '@/utils/sqlHelpers';
import SqlEditor from '@/components/SqlEditor';
import AnimatedButton from '@/components/AnimatedButton';
import SectionHeading from '@/components/SectionHeading';
import { Play, Trash2, Layers, Percent, Database } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MinifierClient() {
  const [inputSql, setInputSql] = useState('');
  const [outputSql, setOutputSql] = useState('');
  const [stats, setStats] = useState({
    originalSize: 0,
    minifiedSize: 0,
    ratio: 0,
    savedBytes: 0,
  });
  const [autoMinify, setAutoMinify] = useState(true);

  // Minification processing
  const handleMinify = () => {
    if (!inputSql || !inputSql.trim()) {
      toast.error('Please enter a SQL query to minify.');
      return;
    }

    const { minified, originalSize, minifiedSize, ratio } = minifySql(inputSql);
    setOutputSql(minified);
    setStats({
      originalSize,
      minifiedSize,
      ratio,
      savedBytes: Math.max(0, originalSize - minifiedSize),
    });
    toast.success('SQL Minified and compressed!');
  };

  const performSilentMinify = (sqlText) => {
    if (!sqlText || !sqlText.trim()) {
      setOutputSql('');
      setStats({ originalSize: 0, minifiedSize: 0, ratio: 0, savedBytes: 0 });
      return;
    }
    const { minified, originalSize, minifiedSize, ratio } = minifySql(sqlText);
    setOutputSql(minified);
    setStats({
      originalSize,
      minifiedSize,
      ratio,
      savedBytes: Math.max(0, originalSize - minifiedSize),
    });
  };

  // Keyboard shortcut: Ctrl+Enter to minify
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleMinify();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [inputSql]);

  // Auto Minify trigger
  useEffect(() => {
    if (autoMinify && inputSql) {
      const delay = setTimeout(() => {
        performSilentMinify(inputSql);
      }, 300);
      return () => clearTimeout(delay);
    }
  }, [inputSql, autoMinify]);

  const handleClear = () => {
    setInputSql('');
    setOutputSql('');
    setStats({ originalSize: 0, minifiedSize: 0, ratio: 0, savedBytes: 0 });
    toast.success('Minifier workspace cleared.');
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Background Glowing Orb */}
      <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-gradient-to-tr from-amber-500/10 via-rose-500/5 to-transparent blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <SectionHeading
          badge="Compression Suite"
          title="SQL Minifier & Compressor"
          description="Shrink your SQL schema definitions or seeding transactions by removing comments, carriage breaks, and whitespace delimiters. Ideal for reducing API payload limits."
          align="left"
          className="max-w-2xl"
        />
        <div className="flex gap-2">
          <AnimatedButton onClick={handleMinify} variant="primary" icon={Play}>
            Compress (Ctrl+Enter)
          </AnimatedButton>
          <AnimatedButton onClick={handleClear} variant="secondary" icon={Trash2}>
            Clear
          </AnimatedButton>
        </div>
      </div>

      {/* Auto Minify & Configurations bar */}
      <div className="relative rounded-2xl bg-white/40 dark:bg-[#070a10]/50 backdrop-blur-xl border border-dark-border dark:border-white/5 p-5 shadow-xl overflow-hidden flex flex-wrap items-center justify-between gap-4 group z-10">
        
        
        <div className="flex items-center gap-4 select-none">
          <div className="flex items-center gap-2.5 group/toggle">
            <input
              type="checkbox"
              id="autoMinify"
              checked={autoMinify}
              onChange={(e) => setAutoMinify(e.target.checked)}
              suppressHydrationWarning
              className="w-4 h-4 accent-brand-primary rounded cursor-pointer animate-pulse"
            />
            <label htmlFor="autoMinify" className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group-hover/toggle:text-brand-primary transition-colors">
              Auto Minify Active
            </label>
          </div>
        </div>

        {/* Compression Statistics Row */}
        {stats.originalSize > 0 && (
          <div className="flex flex-wrap items-center gap-5 text-xs font-mono text-gray-500 select-none">
            <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg">
              <Database size={13} className="text-gray-400" />
              <span>Original: <strong className="text-gray-800 dark:text-gray-200">{stats.originalSize} B</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2.5 py-1 rounded-lg">
              <Layers size={13} className="text-gray-400" />
              <span>Compressed: <strong className="text-gray-800 dark:text-gray-200">{stats.minifiedSize} B</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-brand-emerald/10 text-brand-emerald px-2.5 py-1 rounded-lg border border-brand-emerald/25">
              <span>Reduction: <strong className="font-bold">{stats.ratio}%</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Editors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        <SqlEditor
          value={inputSql}
          onChange={setInputSql}
          title="Raw SQL Script Input"
          dialect=""
          placeholder="-- Paste massive INSERT seeding blocks or query logs here...&#10;/* Multi-line comments and single line comments are stripped automatically */&#10;SELECT *&#10;FROM employees&#10;WHERE department_id = 12&#10;AND hire_date >= '2025-01-01';"
          actions={['copy', 'download', 'upload', 'clear', 'wrap']}
          onClear={handleClear}
        />
        <SqlEditor
          value={outputSql}
          readOnly={true}
          title="Minified SQL Output"
          dialect="MINIFIED"
          placeholder="-- Compressed string will appear here instantly..."
          actions={['copy', 'download', 'wrap']}
        />
      </div>

      {/* Stats details panel */}
      {stats.originalSize > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative z-10">
          
          {/* Card 1: Original Size */}
          <div className="relative rounded-2xl bg-white/40 dark:bg-[#080d16]/60 border border-dark-border dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10 p-5 shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 overflow-hidden">
            
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Original Footprint</span>
            <div className="text-3xl font-black font-mono text-gray-900 dark:text-white mt-2">
              {stats.originalSize} <span className="text-sm font-normal text-gray-400 font-sans">Bytes</span>
            </div>
            <span className="text-xs text-gray-500 mt-2 block font-sans">Total volume of raw characters in SQL.</span>
          </div>

          {/* Card 2: Compressed Size */}
          <div className="relative rounded-2xl bg-white/40 dark:bg-[#080d16]/60 border border-dark-border dark:border-white/5 hover:border-brand-primary/30 p-5 shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 overflow-hidden">
            
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Compressed Footprint</span>
            <div className="text-3xl font-black font-mono text-brand-primary mt-2">
              {stats.minifiedSize} <span className="text-sm font-normal text-gray-400 font-sans">Bytes</span>
            </div>
            <span className="text-xs text-gray-500 mt-2 block font-sans">Whitespace and comments fully excluded.</span>
          </div>

          {/* Card 3: Reduction Rating */}
          <div className="relative rounded-2xl bg-white/40 dark:bg-[#080d16]/60 border border-dark-border dark:border-white/5 hover:border-brand-emerald/30 p-5 shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1 overflow-hidden">
            
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Saved Storage Space</span>
            <div className="text-3xl font-black font-mono text-brand-emerald mt-2">
              {stats.ratio}% <span className="text-sm font-normal text-gray-400 font-sans">Saved</span>
            </div>
            <span className="text-xs text-gray-500 mt-2 block font-sans">Compressed SQL by {stats.savedBytes} raw bytes.</span>
          </div>

        </div>
      )}

    </div>
  );
}
