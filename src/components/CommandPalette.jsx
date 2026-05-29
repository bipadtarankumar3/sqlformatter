'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSqlStore } from '@/store/sqlStore';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Search, Terminal, ShieldAlert, Sparkles, HelpCircle, 
  Settings, BookOpen, Layers, CheckSquare, Sun, Moon, 
  Trash2, FileCode, Info, Mail
} from 'lucide-react';
import { exampleQueries } from '@/utils/exampleQueries';
import toast from 'react-hot-toast';

export default function CommandPalette() {
  const router = useRouter();
  const { 
    commandPaletteOpen, 
    setCommandPaletteOpen, 
    theme, 
    toggleTheme, 
    clearHistory 
  } = useSqlStore();

  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Core navigation items with custom glowing colors
  const tools = [
    { 
      name: 'SQL Formatter & Beautifier', 
      desc: 'Beautify queries side-by-side', 
      path: '/formatter', 
      icon: Terminal, 
      category: 'Tools',
      colors: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
    },
    { 
      name: 'SQL Minifier & Compressor', 
      desc: 'Shrink whitespace and lines', 
      path: '/minifier', 
      icon: Layers, 
      category: 'Tools',
      colors: 'bg-amber-500/10 text-amber-500 border-amber-500/20'
    },
    { 
      name: 'SQL Validator & Safety Shield', 
      desc: 'Scan for missing semicolons & risk keywords', 
      path: '/validator', 
      icon: ShieldAlert, 
      category: 'Tools',
      colors: 'bg-rose-500/10 text-rose-500 border-rose-500/20'
    },
    { 
      name: 'SQL Query Analyzer', 
      desc: 'Inspect joins, tables, column specs & metrics', 
      path: '/analyzer', 
      icon: Sparkles, 
      category: 'Tools',
      colors: 'bg-purple-500/10 text-purple-500 border-purple-500/20'
    },
    { 
      name: 'SQL Cheat Sheet Index', 
      desc: 'Quick searchable syntax guides', 
      path: '/cheatsheet', 
      icon: BookOpen, 
      category: 'Resources',
      colors: 'bg-sky-500/10 text-sky-500 border-sky-500/20'
    },
    { 
      name: 'SQL Keywords Explorer', 
      desc: 'Interactive keyword usage definitions', 
      path: '/keywords', 
      icon: CheckSquare, 
      category: 'Resources',
      colors: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
    },
    { 
      name: 'SQL Query Templates Gallery', 
      desc: 'Load dialect sample queries', 
      path: '/examples', 
      icon: FileCode, 
      category: 'Resources',
      colors: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    },
    { 
      name: 'Developer Blog', 
      desc: 'Read database optimization articles', 
      path: '/blog', 
      icon: BookOpen, 
      category: 'Information',
      colors: 'bg-teal-500/10 text-teal-500 border-teal-500/20'
    },
    { 
      name: 'About SQL Beast', 
      desc: 'Meet our vision & developer guidelines', 
      path: '/about', 
      icon: Info, 
      category: 'Information',
      colors: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
    },
    { 
      name: 'Contact & Feedback', 
      desc: 'Submit bugs or feature requests', 
      path: '/contact', 
      icon: Mail, 
      category: 'Information',
      colors: 'bg-pink-500/10 text-pink-500 border-pink-500/20'
    },
  ];

  const actions = [
    { 
      name: 'Toggle Visual Theme', 
      desc: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, 
      action: 'toggle-theme', 
      icon: theme === 'dark' ? Sun : Moon, 
      category: 'Actions',
      colors: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    },
    { 
      name: 'Clear Formatted History', 
      desc: 'Wipe all cached local storage items', 
      action: 'clear-history', 
      icon: Trash2, 
      category: 'Actions',
      colors: 'bg-red-500/10 text-red-500 border-red-500/20'
    },
  ];

  // Map examples into searchable format
  const templateItems = exampleQueries.map(eq => ({
    name: eq.name,
    desc: eq.description,
    path: `/formatter?load=${eq.id}`,
    icon: FileCode,
    category: 'SQL Query Examples',
    colors: 'bg-violet-500/10 text-violet-500 border-violet-500/20'
  }));

  // Combine items
  const allItems = [...tools, ...actions, ...templateItems];

  // Filter items based on search input
  const filteredItems = allItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) || 
    item.desc.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Reset index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Global keydown listeners for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        e.preventDefault();
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  // Command palette keyboard navigation
  useEffect(() => {
    if (!commandPaletteOpen) return;

    const handleNav = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          triggerItem(filteredItems[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleNav);
    return () => window.removeEventListener('keydown', handleNav);
  }, [commandPaletteOpen, selectedIndex, filteredItems]);

  // Focus input when opened
  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch('');
    }
  }, [commandPaletteOpen]);

  // Trigger selection
  const triggerItem = (item) => {
    setCommandPaletteOpen(false);
    if (item.path) {
      router.push(item.path);
    } else if (item.action) {
      if (item.action === 'toggle-theme') {
        toggleTheme();
        toast.success(`Switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`);
      } else if (item.action === 'clear-history') {
        clearHistory();
        toast.success('Formatted history cleared successfully.');
      }
    }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 select-none">
          {/* Backdrop Blur overlay with elegant dark fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-[6px] cursor-pointer"
          />

          {/* Dialog Container */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.96, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -15 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0.08 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white dark:bg-[#0d121f] border border-black/10 dark:border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.5)] flex flex-col max-h-[65vh] z-10"
          >
            {/* Top Linear Gradient Highlight Line */}
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500" />

            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-5 border-b border-black/[0.06] dark:border-white/5 h-16 shrink-0">
              <Search size={18} className="text-indigo-600 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                suppressHydrationWarning
                placeholder="Type a tool name, dialect, template, or setting..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-0 outline-none text-xs font-semibold h-full text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
              />
              <kbd className="hidden sm:inline-flex text-[9px] bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md text-gray-500 dark:text-gray-400 font-mono border border-black/5 dark:border-white/10 shadow-sm select-none">ESC</kbd>
            </div>

            {/* Suggestions Container */}
            <div className="overflow-y-auto flex-1 p-3.5 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-16 text-center text-gray-400 text-sm flex flex-col items-center justify-center gap-2 animate-fade-in">
                  <HelpCircle size={32} className="text-gray-500 animate-bounce" />
                  <p className="font-semibold text-gray-700 dark:text-gray-300">No tools found for &ldquo;<span className="text-brand-primary">{search}</span>&rdquo;</p>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">Try searching keywords like &ldquo;beautifier&rdquo;, &ldquo;dialects&rdquo;, &ldquo;unsafe&rdquo; or &ldquo;history&rdquo;.</p>
                </div>
              ) : (
                Object.entries(
                  filteredItems.reduce((acc, item) => {
                    if (!acc[item.category]) acc[item.category] = [];
                    acc[item.category].push(item);
                    return acc;
                  }, {})
                ).map(([category, items]) => (
                  <div key={category} className="space-y-0.5">
                    {/* Category Title */}
                    <div className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase px-3.5 py-2 mt-2 select-none">
                      {category}
                    </div>

                    {/* Category Items */}
                    <div className="space-y-1">
                      {items.map((item) => {
                        const globalIndex = filteredItems.indexOf(item);
                        const isSelected = globalIndex === selectedIndex;
                        const Icon = item.icon;

                        return (
                          <button
                            key={item.name}
                            onClick={() => triggerItem(item)}
                            onMouseEnter={() => setSelectedIndex(globalIndex)}
                            suppressHydrationWarning
                            className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 text-left relative overflow-hidden group cursor-pointer z-10"
                          >
                            {/* Dynamic selection background with fluid spring indicator */}
                            {isSelected && (
                              <motion.div
                                layoutId="activeSearchSelection"
                                className="absolute inset-0 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 rounded-xl shadow-sm -z-10"
                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                              />
                            )}

                            <div className="flex items-center gap-3.5 relative z-10">
                              {/* Colored Glowing Icon container */}
                              <div className={`p-2.5 rounded-xl shrink-0 border transition-all duration-350 ${
                                isSelected 
                                  ? `${item.colors} scale-105 shadow-[0_0_15px_rgba(99,102,241,0.15)]` 
                                  : 'bg-black/5 dark:bg-white/5 text-gray-400 border-black/5 dark:border-white/5'
                              }`}>
                                <Icon size={16} className={isSelected ? 'animate-pulse' : ''} />
                              </div>
                              <div>
                                <div className={`text-xs font-bold transition-colors duration-150 ${isSelected ? 'text-indigo-650 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-200'}`}>{item.name}</div>
                                <div className="text-[10px] text-gray-400 dark:text-gray-500 line-clamp-1 mt-0.5">{item.desc}</div>
                              </div>
                            </div>
                            
                            {/* Keycap ENTER marker */}
                            {isSelected && (
                              <motion.span 
                                initial={{ opacity: 0, x: 5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[9px] font-bold font-mono bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50 px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1 z-10 select-none shrink-0"
                              >
                                Enter ↵
                              </motion.span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer keyboard hints */}
            <div className="border-t border-black/[0.06] dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] px-5 py-3.5 text-[10px] text-gray-400 dark:text-gray-500 flex items-center justify-between font-mono shrink-0 select-none">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><kbd className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded border border-black/[0.05] dark:border-white/10">↑↓</kbd> Navigate</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-black/5 dark:bg-white/10 px-1 py-0.5 rounded border border-black/[0.05] dark:border-white/10">↵</kbd> Select</span>
              </div>
              <div className="hidden sm:block">
                <span>Press <kbd className="bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded border border-black/5 dark:border-white/10 shadow-sm">Ctrl + K</kbd> anywhere</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
