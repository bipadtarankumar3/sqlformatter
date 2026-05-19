'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSqlStore } from '@/store/sqlStore';
import { formatSql } from '@/utils/sqlHelpers';
import { exampleQueries } from '@/utils/exampleQueries';
import SqlEditor from '@/components/SqlEditor';
import AnimatedButton from '@/components/AnimatedButton';
import SectionHeading from '@/components/SectionHeading';
import { 
  Play, Trash2, Heart, History, Settings, Sparkles, 
  ArrowRightLeft, FileCode, CheckSquare, Layers
} from 'lucide-react';
import toast from 'react-hot-toast';

function FormatterContent({ hideHeader = false }) {
  const searchParams = useSearchParams();

  // Load state and options from Zustand
  const {
    dialect, setDialect,
    indentSize, setIndentSize,
    useTabs, setUseTabs,
    keywordCase, setKeywordCase,
    compactMode, setCompactMode,
    preserveComments, setPreserveComments,
    autoFormat, setAutoFormat,
    history, addHistory, clearHistory,
    favorites, addFavorite, removeFavorite,
  } = useSqlStore();

  // Local state
  const [inputSql, setInputSql] = useState('');
  const [outputSql, setOutputSql] = useState('');
  const [favoriteName, setFavoriteName] = useState('');
  const [showHistory, setShowHistory] = useState(true);

  // Trigger SQL formatting logic
  const handleFormat = () => {
    if (!inputSql || !inputSql.trim()) {
      toast.error('Please enter a SQL query to format.');
      return;
    }

    const formatted = formatSql(inputSql, {
      dialect,
      indentSize,
      useTabs,
      keywordCase,
      compactMode,
      preserveComments,
    });

    setOutputSql(formatted);
    addHistory(inputSql, formatted, dialect);
    toast.success('SQL Beautified successfully!');
  };

  // Safe formatting without toast (for auto-formatting)
  const performSilentFormat = (sqlText) => {
    if (!sqlText || !sqlText.trim()) {
      setOutputSql('');
      return;
    }
    const formatted = formatSql(sqlText, {
      dialect,
      indentSize,
      useTabs,
      keywordCase,
      compactMode,
      preserveComments,
    });
    setOutputSql(formatted);
  };

  // Keyboard Shortcuts: Ctrl+Enter to format, Ctrl+Esc to clear
  useEffect(() => {
    const handleShortcuts = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleFormat();
      }
      if (e.ctrlKey && e.key === 'Escape') {
        e.preventDefault();
        handleClear();
      }
    };
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [inputSql, dialect, indentSize, useTabs, keywordCase, compactMode, preserveComments]);

  // Load query template from search parameters on mounting
  useEffect(() => {
    const loadId = searchParams.get('load');
    if (loadId) {
      const selectedQuery = exampleQueries.find(eq => eq.id === loadId);
      if (selectedQuery) {
        setInputSql(selectedQuery.sql);
        setDialect(selectedQuery.dialect);
        toast.success(`Loaded ${selectedQuery.name}`);
        // Perform an initial format
        const formatted = formatSql(selectedQuery.sql, {
          dialect: selectedQuery.dialect,
          indentSize,
          useTabs,
          keywordCase,
          compactMode,
          preserveComments,
        });
        setOutputSql(formatted);
      }
    }
  }, [searchParams]);

  // Auto Format listener
  useEffect(() => {
    if (autoFormat && inputSql) {
      const delayDebounce = setTimeout(() => {
        performSilentFormat(inputSql);
      }, 350); // 350ms debounce
      return () => clearTimeout(delayDebounce);
    }
  }, [inputSql, autoFormat, dialect, indentSize, useTabs, keywordCase, compactMode, preserveComments]);

  // Trigger clearing editor values
  const handleClear = () => {
    setInputSql('');
    setOutputSql('');
    toast.success('Editors cleared.');
  };

  // Load a query from favorites or local history
  const handleLoadQuery = (sql, queryDialect) => {
    setInputSql(sql);
    setDialect(queryDialect);
    
    const formatted = formatSql(sql, {
      dialect: queryDialect,
      indentSize,
      useTabs,
      keywordCase,
      compactMode,
      preserveComments,
    });
    setOutputSql(formatted);
    toast.success('Query loaded into workspace.');
  };

  // Save query to Favorites list
  const handleSaveFavorite = (e) => {
    e.preventDefault();
    if (!inputSql || !inputSql.trim()) {
      toast.error('Please enter SQL code to save as a favorite.');
      return;
    }
    const name = favoriteName.trim() || `Query - ${dialect} (${new Date().toLocaleDateString()})`;
    addFavorite(name, inputSql, dialect);
    setFavoriteName('');
    toast.success('Query added to Favorites!');
  };

  return (
    <div className="space-y-8 animate-fade-in relative z-10 w-full">
      
      {/* 1. Header Details */}
      {!hideHeader && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
          <SectionHeading
            badge="Formatter Tool"
            title="SQL Formatter & Beautifier"
            description="Format your SQL statements into clean, readable developer scripts instantly. Select dialect casing, indents, comments preferences, and save templates."
            align="left"
            className="max-w-2xl"
          />
          <div className="flex gap-2">
            <AnimatedButton onClick={handleFormat} variant="primary" icon={Play}>
              Format (Ctrl+Enter)
            </AnimatedButton>
            <AnimatedButton onClick={handleClear} variant="secondary" icon={Trash2}>
              Clear
            </AnimatedButton>
          </div>
        </div>
      )}

      {/* 2. Options Toolbar (Pill Design) */}
      <div className="relative rounded-2xl sm:rounded-[2rem] bg-white/70 dark:bg-[#0b0e14]/60 backdrop-blur-xl border border-slate-200/80 dark:border-white/5 p-2 sm:p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-xl mt-4 flex flex-col xl:flex-row items-center justify-between gap-3 w-full">
        
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider select-none px-2 hidden sm:flex">
            <Settings size={14} className="animate-spin-slow" />
          </div>

          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
            suppressHydrationWarning
            className="text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-700 dark:text-slate-200 outline-none hover:bg-white dark:hover:bg-white/10 hover:border-indigo-300 dark:hover:border-white/20 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm cursor-pointer"
          >
            <option value="MySQL">MySQL</option>
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="SQLite">SQLite</option>
            <option value="SQL Server">SQL Server</option>
            <option value="MariaDB">MariaDB</option>
            <option value="Oracle">Oracle</option>
          </select>

          <select
            value={indentSize}
            onChange={(e) => {
              setUseTabs(e.target.value === 'tabs');
              if (e.target.value !== 'tabs') {
                setIndentSize(Number(e.target.value));
              }
            }}
            suppressHydrationWarning
            className="text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-700 dark:text-slate-200 outline-none hover:bg-white dark:hover:bg-white/10 hover:border-indigo-300 dark:hover:border-white/20 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm cursor-pointer"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value="tabs">Tabs</option>
          </select>

          <select
            value={keywordCase}
            onChange={(e) => setKeywordCase(e.target.value)}
            suppressHydrationWarning
            className="text-xs font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 text-slate-700 dark:text-slate-200 outline-none hover:bg-white dark:hover:bg-white/10 hover:border-indigo-300 dark:hover:border-white/20 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm cursor-pointer"
          >
            <option value="upper">UPPERCASE</option>
            <option value="lower">lowercase</option>
            <option value="preserve">Preserve Case</option>
          </select>

          <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 bg-slate-50/50 dark:bg-white/5 py-2 sm:py-2.5 rounded-full border border-slate-200/80 dark:border-white/10">
            <label className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider cursor-pointer hover:text-indigo-500 transition-colors">
              <input type="checkbox" checked={compactMode} onChange={(e) => setCompactMode(e.target.checked)} suppressHydrationWarning className="w-3.5 h-3.5 rounded text-indigo-500 border-slate-300 focus:ring-indigo-500/30 cursor-pointer" />
              Compact
            </label>
            <label className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider cursor-pointer hover:text-indigo-500 transition-colors">
              <input type="checkbox" checked={preserveComments} onChange={(e) => setPreserveComments(e.target.checked)} suppressHydrationWarning className="w-3.5 h-3.5 rounded text-indigo-500 border-slate-300 focus:ring-indigo-500/30 cursor-pointer" />
              Comments
            </label>
            <label className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider cursor-pointer hover:text-indigo-500 transition-colors">
              <input type="checkbox" checked={autoFormat} onChange={(e) => setAutoFormat(e.target.checked)} suppressHydrationWarning className="w-3.5 h-3.5 rounded text-indigo-500 border-slate-300 focus:ring-indigo-500/30 cursor-pointer" />
              Auto
            </label>
          </div>
        </div>

        {hideHeader && (
          <div className="flex items-center gap-2 shrink-0">
            <AnimatedButton onClick={handleClear} variant="ghost" icon={Trash2} className="px-3 py-1.5 text-xs">
              Clear
            </AnimatedButton>
            <AnimatedButton onClick={handleFormat} variant="primary" icon={Play} className="px-4 py-1.5 text-xs bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
              Format SQL
            </AnimatedButton>
          </div>
        )}
      </div>

      {/* 3. Editors side-by-side grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-full">
        <SqlEditor
          value={inputSql}
          onChange={setInputSql}
          title="Input SQL Code"
          dialect={dialect}
          placeholder="-- Type your raw SQL query here...&#10;SELECT customer_name, order_date, total_price FROM orders JOIN customers ON orders.customer_id = customers.id WHERE orders.amount > 1000;"
          actions={['copy', 'download', 'upload', 'clear', 'wrap']}
          onClear={handleClear}
        />
        <SqlEditor
          value={outputSql}
          readOnly={true}
          title="Formatted SQL Result"
          dialect={dialect}
          placeholder="-- Formatted query will appear here instantly..."
          actions={['copy', 'download', 'wrap']}
        />
      </div>

      {/* 4. Favorites & History Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 relative z-10 w-full">
        
        {/* Save Current as Bookmarks */}
        <div className="relative rounded-2xl bg-white/40 dark:bg-[#070a10]/50 backdrop-blur-xl border border-dark-border dark:border-white/5 p-5 shadow-lg overflow-hidden group">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-brand-rose to-brand-purple opacity-80" />
          
          <div className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-wider select-none mb-3">
            <Heart size={14} className="text-brand-rose fill-brand-rose animate-pulse" />
            <span>Bookmark Query</span>
          </div>
          <form onSubmit={handleSaveFavorite} className="space-y-4">
            <p className="text-[11px] text-gray-500 leading-normal font-sans">
              Bookmark this input query by giving it a name. It will be cached for easy recovery.
            </p>
            <input
              type="text"
              placeholder="e.g. Sales Report Monthly Query"
              value={favoriteName}
              onChange={(e) => setFavoriteName(e.target.value)}
              suppressHydrationWarning
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/25 text-gray-800 dark:text-gray-200 outline-none hover:border-brand-primary/40 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/25 transition-all duration-300 placeholder-gray-500 shadow-sm"
            />
            <AnimatedButton type="submit" variant="secondary" className="w-full text-xs font-bold py-2.5" disabled={!inputSql}>
              Save to Favorites
            </AnimatedButton>
          </form>
        </div>

        {/* Favorites list */}
        <div className="relative rounded-2xl bg-white/40 dark:bg-[#070a10]/50 backdrop-blur-xl border border-dark-border dark:border-white/5 p-5 shadow-lg overflow-hidden flex flex-col max-h-[300px]">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-brand-rose to-brand-primary opacity-80" />
          
          <div className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-wider select-none shrink-0 mb-3.5">
            <Heart size={14} className="text-brand-rose" />
            <span>Saved Favorites ({favorites.length})</span>
          </div>
          
          <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar">
            {favorites.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-xs text-gray-500 py-12">
                No bookmarked queries.
              </div>
            ) : (
              favorites.map((fav) => (
                <div key={fav.id} className="flex items-center justify-between p-2.5 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/5 hover:border-brand-rose/30 transition-all duration-300">
                  <button
                    onClick={() => handleLoadQuery(fav.sql, fav.dialect)}
                    suppressHydrationWarning
                    className="flex-1 text-left cursor-pointer pr-2"
                  >
                    <div className="text-[11px] font-bold text-gray-800 dark:text-gray-200 truncate">{fav.name}</div>
                    <div className="text-[9px] text-gray-500 font-mono tracking-wider mt-0.5 uppercase">{fav.dialect}</div>
                  </button>
                  <button
                    onClick={() => {
                      removeFavorite(fav.id);
                      toast.success('Removed favorite.');
                    }}
                    suppressHydrationWarning
                    className="p-1.5 rounded bg-brand-rose/10 hover:bg-brand-rose/25 text-brand-rose transition-colors cursor-pointer"
                    title="Remove Favorite"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent History */}
        <div className="relative rounded-2xl bg-white/40 dark:bg-[#070a10]/50 backdrop-blur-xl border border-dark-border dark:border-white/5 p-5 shadow-lg overflow-hidden flex flex-col max-h-[300px]">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-brand-primary to-brand-emerald opacity-80" />
          
          <div className="flex items-center justify-between gap-2 shrink-0 mb-3.5 select-none">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-wider">
              <History size={14} />
              <span>Workspace History ({history.length})</span>
            </div>
            {history.length > 0 && (
              <button
                onClick={() => {
                  clearHistory();
                  toast.success('History cleared.');
                }}
                suppressHydrationWarning
                className="text-xs text-brand-rose font-bold hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1 space-y-2 pr-1 custom-scrollbar">
            {history.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-xs text-gray-500 py-12">
                No recent workspace queries.
              </div>
            ) : (
              history.map((hist) => (
                <button
                  key={hist.id}
                  onClick={() => handleLoadQuery(hist.originalSql, hist.dialect)}
                  suppressHydrationWarning
                  className="w-full text-left p-2.5 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/5 hover:border-brand-primary/30 transition-all duration-300 flex items-start justify-between cursor-pointer group"
                >
                  <div className="flex-1 pr-2 truncate">
                    <div className="text-[10px] font-mono text-gray-700 dark:text-gray-300 truncate font-semibold group-hover:text-brand-primary transition-colors">
                      {hist.originalSql.replace(/\s+/g, ' ')}
                    </div>
                    <div className="text-[9px] text-gray-500 font-mono flex items-center gap-1.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald/70 animate-ping" />
                      <span className="uppercase font-bold text-gray-600 dark:text-gray-400">{hist.dialect}</span>
                      <span>•</span>
                      <span>{new Date(hist.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default function FormatterWidget({ hideHeader = false }) {
  return (
    <Suspense fallback={
      <div className="py-24 text-center text-xs text-gray-500 animate-pulse">
        Loading Formatter configuration...
      </div>
    }>
      <FormatterContent hideHeader={hideHeader} />
    </Suspense>
  );
}
