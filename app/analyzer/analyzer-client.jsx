'use client';

import { useState, useEffect } from 'react';
import { analyzeQuery } from '@/utils/sqlHelpers';
import SqlEditor from '@/components/SqlEditor';
import AnimatedButton from '@/components/AnimatedButton';
import SectionHeading from '@/components/SectionHeading';
import { 
  Play, Trash2, BarChart2, Table, Columns, 
  AlertTriangle, CpuCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function AnalyzerClient() {
  const [inputSql, setInputSql] = useState('');
  const [analysis, setAnalysis] = useState({
    tables: [],
    columns: [],
    joins: 0,
    subqueries: 0,
    aggregates: [],
    warnings: [],
    complexity: { score: 0, label: 'Low' }
  });
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [autoAnalyze, setAutoAnalyze] = useState(true);

  // Trigger analysis processing
  const handleAnalyze = () => {
    if (!inputSql || !inputSql.trim()) {
      toast.error('Please enter a SQL query to analyze.');
      return;
    }

    const result = analyzeQuery(inputSql);
    setAnalysis(result);
    setHasAnalyzed(true);
    toast.success('Query analyzed successfully.');
  };

  const performSilentAnalysis = (sqlText) => {
    if (!sqlText || !sqlText.trim()) {
      setHasAnalyzed(false);
      setAnalysis({
        tables: [],
        columns: [],
        joins: 0,
        subqueries: 0,
        aggregates: [],
        warnings: [],
        complexity: { score: 0, label: 'Low' }
      });
      return;
    }
    const result = analyzeQuery(sqlText);
    setAnalysis(result);
    setHasAnalyzed(true);
  };

  // Keyboard shortcut: Ctrl+Enter to analyze
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleAnalyze();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [inputSql]);

  // Auto analyze trigger
  useEffect(() => {
    if (autoAnalyze && inputSql) {
      const delay = setTimeout(() => {
        performSilentAnalysis(inputSql);
      }, 350);
      return () => clearTimeout(delay);
    }
  }, [inputSql, autoAnalyze]);

  const handleClear = () => {
    setInputSql('');
    setHasAnalyzed(false);
    setAnalysis({
      tables: [],
      columns: [],
      joins: 0,
      subqueries: 0,
      aggregates: [],
      warnings: [],
      complexity: { score: 0, label: 'Low' }
    });
    toast.success('Analyzer workspace cleared.');
  };

  // Complexity Label colors helper
  const getComplexityColor = (label) => {
    switch (label?.toLowerCase()) {
      case 'low':
        return 'text-brand-emerald bg-brand-emerald/10 border-brand-emerald/20';
      case 'medium':
        return 'text-brand-primary bg-brand-primary/10 border-brand-primary/20';
      case 'high':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'extreme':
        return 'text-brand-rose bg-brand-rose/10 border-brand-rose/20 animate-pulse';
      default:
        return 'text-gray-400 bg-white/5';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Background Glowing Orb */}
      <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-gradient-to-tr from-brand-purple/10 via-brand-primary/5 to-transparent blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <SectionHeading
          badge="Query Profiler"
          title="SQL Query Analyzer"
          description="Trace relational architectures in your queries. Retrieve column scopes, nested partitions, joins metrics, complexity ratings, and key database engine alerts."
          align="left"
          className="max-w-2xl"
        />
        <div className="flex gap-2">
          <AnimatedButton onClick={handleAnalyze} variant="primary" icon={Play}>
            Analyze Query (Ctrl+Enter)
          </AnimatedButton>
          <AnimatedButton onClick={handleClear} variant="secondary" icon={Trash2}>
            Clear
          </AnimatedButton>
        </div>
      </div>

      {/* Auto scan setting bar */}
      <div className="relative rounded-2xl bg-white/40 dark:bg-[#070a10]/50 backdrop-blur-xl border border-dark-border dark:border-white/5 p-5 shadow-xl overflow-hidden flex items-center justify-between gap-4 group z-10">
        
        
        <div className="flex items-center gap-2.5 select-none group/toggle">
          <input
            type="checkbox"
            id="autoAnalyze"
            checked={autoAnalyze}
            onChange={(e) => setAutoAnalyze(e.target.checked)}
            suppressHydrationWarning
            className="w-4 h-4 accent-brand-primary rounded cursor-pointer animate-pulse"
          />
          <label htmlFor="autoAnalyze" className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer group-hover/toggle:text-brand-primary transition-colors">
            Auto Analyze Active
          </label>
        </div>
      </div>

      {/* Editor & Report Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Editor column */}
        <div className="lg:col-span-2">
          <SqlEditor
            value={inputSql}
            onChange={setInputSql}
            title="SQL Performance Sandbox"
            dialect=""
            placeholder="-- Paste SELECT statement here to trace execution patterns...&#10;SELECT c.company_name, COUNT(o.id) AS total_orders&#10;FROM customers c LEFT JOIN orders o ON c.id = o.customer_id&#10;GROUP BY c.company_name&#10;HAVING total_orders > 10;"
            actions={['copy', 'download', 'upload', 'clear', 'wrap']}
            onClear={handleClear}
          />
        </div>

        {/* Audit Dashboard panel */}
        <div className="space-y-6 flex flex-col justify-start">
          
          {/* Quick Metrics grid */}
          <div className="relative rounded-2xl bg-white/40 dark:bg-[#070a10]/50 backdrop-blur-xl border border-dark-border dark:border-white/5 p-5 shadow-xl overflow-hidden group">
            
            
            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider select-none mb-3">
              Metrics Breakdown
            </h3>

            {!hasAnalyzed ? (
              <div className="text-center py-12 text-xs text-gray-500 flex flex-col items-center justify-center gap-3">
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-dark-border/40 dark:border-white/10">
                  <BarChart2 size={26} className="text-gray-400 dark:text-gray-500 animate-pulse" />
                </div>
                <p className="font-bold text-gray-700 dark:text-gray-300">Profiler Standby.</p>
                <p className="text-[10px] text-gray-400">Enter queries to inspect relational matrices.</p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Score card */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-white/50 dark:bg-black/25 border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Complexity Score</div>
                    <div className="text-2xl font-black font-mono mt-1 text-gray-900 dark:text-white leading-none">
                      {analysis.complexity.score}
                    </div>
                  </div>
                  
                  <div className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors duration-300 ${getComplexityColor(analysis.complexity.label)}`}>
                    <span className="text-[9px] font-bold uppercase tracking-wider">Complexity Rating</span>
                    <span className="text-sm font-black font-mono leading-none mt-1">{analysis.complexity.label}</span>
                  </div>
                </div>

                {/* Substats */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="p-3 rounded-xl bg-white/50 dark:bg-black/20 text-center border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="text-[9px] font-bold text-gray-400 uppercase">Joins</div>
                    <div className="text-base font-black font-mono mt-1 text-gray-800 dark:text-gray-200 leading-none">{analysis.joins}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/50 dark:bg-black/20 text-center border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="text-[9px] font-bold text-gray-400 uppercase">Tables</div>
                    <div className="text-base font-black font-mono mt-1 text-gray-800 dark:text-gray-200 leading-none">{analysis.tables.length}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/50 dark:bg-black/20 text-center border border-slate-200 dark:border-white/5 shadow-sm">
                    <div className="text-[9px] font-bold text-gray-400 uppercase">Subqueries</div>
                    <div className="text-base font-black font-mono mt-1 text-gray-800 dark:text-gray-200 leading-none">{analysis.subqueries}</div>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Database objects tables/columns referenced */}
          {hasAnalyzed && (analysis.tables.length > 0 || analysis.columns.length > 0) && (
            <div className="relative rounded-2xl bg-white/40 dark:bg-[#070a10]/50 backdrop-blur-xl border border-dark-border dark:border-white/5 p-5 shadow-xl overflow-hidden flex flex-col max-h-[350px]">
              
              
              <div className="overflow-y-auto flex-1 space-y-4.5 pr-1 custom-scrollbar">
                {/* Tables referenced */}
                {analysis.tables.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider select-none">
                      <Table size={11} className="text-brand-primary animate-pulse" />
                      <span>Tables Found ({analysis.tables.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.tables.map((t, idx) => (
                        <span key={`t-${idx}`} className="px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-bold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Columns extracted */}
                {analysis.columns.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider select-none">
                      <Columns size={11} className="text-brand-purple" />
                      <span>Projected Columns ({analysis.columns.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.columns.map((c, idx) => (
                        <span key={`c-${idx}`} className="px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-semibold bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aggregates used */}
                {analysis.aggregates.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-white/5">
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase tracking-wider select-none">
                      <span className="text-[9px] font-bold text-brand-emerald uppercase">Aggregates Applied</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {analysis.aggregates.map((a, idx) => (
                        <span key={`a-${idx}`} className="px-2.5 py-0.5 rounded-lg text-[9px] font-mono font-bold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
                          {a}()
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Query warnings and indexing suggestions */}
      {hasAnalyzed && (
        <section className="relative p-6 rounded-2xl bg-white/40 dark:bg-[#070a10]/50 backdrop-blur-xl border border-dark-border dark:border-white/5 shadow-xl overflow-hidden group z-10 animate-fade-in">
          
          
          <div className="flex items-center gap-2.5">
            <AlertTriangle size={20} className="text-yellow-500 animate-bounce" />
            <h3 className="font-sans font-bold text-sm text-gray-800 dark:text-white">Performance Tuning & Warnings</h3>
          </div>
          
          <div className="mt-4">
            {analysis.warnings.length === 0 ? (
              <div className="p-4 rounded-xl border border-brand-emerald/25 bg-brand-emerald/10 text-brand-emerald text-xs flex items-center gap-2.5 leading-relaxed shadow-sm">
                <span>No major optimization warnings flagged! Query uses clean structural projections and moderate tables alignment.</span>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl">
                {analysis.warnings.map((warn, index) => (
                  <div 
                    key={index}
                    className="p-4 rounded-xl border border-yellow-500/25 bg-yellow-500/5 text-yellow-600 dark:text-yellow-500 text-xs flex items-start gap-3.5 leading-relaxed shadow-sm hover:border-yellow-500/40 transition-all duration-300"
                  >
                    <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold tracking-wide uppercase text-[9px] mb-1">Code: {warn.code}</strong>
                      <p className="text-[11px] leading-relaxed text-gray-700 dark:text-gray-300">{warn.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

    </div>
  );
}
