'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSqlStore } from '@/store/sqlStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Command, Search } from 'lucide-react';
import ThemeSwitcher from './ThemeSwitcher';

export default function Navbar() {
  const pathname = usePathname();
  const { setCommandPaletteOpen } = useSqlStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Formatter', path: '/formatter' },
    { name: 'Minifier', path: '/minifier' },
    { name: 'Validator', path: '/validator' },
    { name: 'Analyzer', path: '/analyzer' },
    { name: 'Cheat Sheet', path: '/cheatsheet' },
    { name: 'Keywords', path: '/keywords' },
    { name: 'Examples', path: '/examples' },
    { name: 'Blog', path: '/blog' },
    { name: 'Services', path: 'https://tools.orbytara.com/services' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-dark-border dark:border-white/5 transition-all">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 h-16 flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group cursor-pointer select-none">
          <div className="relative flex items-center justify-center w-10 h-10 transition-transform duration-300 group-hover:scale-105 rounded-xl overflow-hidden shadow-lg shadow-brand-primary/20 bg-transparent">
            <img src="/logo.png" alt="SQL Beast Logo" className="w-full h-full object-cover invert dark:invert-0 hue-rotate-180 dark:hue-rotate-0 contrast-125 dark:contrast-100 saturate-150 dark:saturate-100" />
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${isActive
                    ? 'text-brand-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-black/5 dark:hover:bg-white/[0.02]'
                  }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 inset-x-3 h-0.5 bg-brand-primary rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* SEARCH & SYSTEM CONTROLS */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Mock Search / Cmd K Input */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            suppressHydrationWarning
            className="flex items-center gap-4 px-3 py-1.5 rounded-lg border border-dark-border bg-black/5 hover:bg-black/10 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 text-xs text-gray-400 cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="text-gray-400" />
              <span>Search tools...</span>
            </div>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-[9px] font-mono select-none">
              <Command size={9} />
              <span>K</span>
            </div>
          </button>

          {/* Theme switcher */}
          {/* <ThemeSwitcher /> */}

          <Link
            href="/formatter"
            className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-brand-primary to-brand-purple hover:from-brand-primary/90 hover:to-brand-purple/90 shadow-md shadow-brand-primary/10 hover:shadow-brand-primary/20 transition-all duration-300 scale-100 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            Launch Formatter
          </Link>
        </div>

        {/* MOBILE CONTROLS (HAMBURGER) */}
        <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
          {/* Command Palette for mobile */}
          <button
            onClick={() => setCommandPaletteOpen(true)}
            suppressHydrationWarning
            className="p-2 rounded-lg border border-dark-border dark:border-white/10 bg-white/5 text-gray-400 cursor-pointer"
            aria-label="Search"
          >
            <Search size={16} />
          </button>

          {/* <ThemeSwitcher /> */}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            suppressHydrationWarning
            className="p-2 rounded-lg border border-dark-border dark:border-white/10 bg-white/5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-100 cursor-pointer transition-all"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-dark-border dark:border-white/5 bg-white/95 dark:bg-dark-bg/95 backdrop-blur-xl overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                        ? 'bg-brand-primary/10 text-brand-primary border-l-4 border-brand-primary pl-3'
                        : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-dark-border dark:border-white/5 mt-4">
                <Link
                  href="/formatter"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-brand-primary to-brand-purple"
                >
                  Launch App
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
