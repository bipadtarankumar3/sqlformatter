'use client';

import { useEffect, useState } from 'react';
import { useSqlStore } from '@/store/sqlStore';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useSqlStore();
  const [mounted, setMounted] = useState(false);

  // Sync class on client mount and theme change
  useEffect(() => {
    setMounted(true);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 animate-pulse" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-dark-border bg-white/5 hover:bg-white/10 dark:border-white/10 dark:hover:bg-white/10 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-200 cursor-pointer"
      aria-label="Toggle theme"
      title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {theme === 'dark' ? (
        <Sun size={18} className="transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon size={18} className="transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
}
