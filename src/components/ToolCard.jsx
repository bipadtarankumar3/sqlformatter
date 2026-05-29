'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function ToolCard({
  title,
  description,
  path,
  icon: Icon,
  badge,
  features = [],
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="relative flex flex-col justify-between p-6 rounded-3xl bg-white/40 dark:bg-[#070a10]/60 backdrop-blur-xl border border-dark-border dark:border-white/5 shadow-lg h-full overflow-hidden group transition-all hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] hover:border-brand-primary/30"
    >
      {/* Background Image */}
      <img src="/card_bg.png" alt="Card Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.03] dark:opacity-[0.1] pointer-events-none mix-blend-overlay" />
      
      {/* Background Glowing Hover Orb */}
      <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-gradient-to-tl from-brand-primary/20 via-brand-purple/10 to-transparent blur-[60px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Absolute Badge */}
      {badge && (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-gradient-to-r from-brand-purple/20 to-brand-primary/20 text-brand-purple border border-brand-purple/30 shadow-[0_0_10px_rgba(139,92,246,0.2)] animate-pulse-slow z-10">
          {badge}
        </div>
      )}

      <div className="space-y-4 relative z-10">
        {/* Icon & Title */}
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-emerald/10 text-brand-primary border border-brand-primary/20 group-hover:bg-brand-primary/20 group-hover:border-brand-primary/40 group-hover:shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all duration-300">
            <Icon size={20} className="transform group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <h3 className="font-sans font-extrabold text-base sm:text-lg text-gray-900 dark:text-white group-hover:text-brand-primary transition-colors duration-300 tracking-tight">
            {title}
          </h3>
        </div>

        {/* Description */}
        <p className="font-sans text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
          {description}
        </p>

        {/* Feature Pill Tags */}
        {features.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {features.map((f, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold tracking-wider bg-black/5 text-gray-600 dark:bg-white/[0.03] dark:text-gray-400 border border-transparent group-hover:border-brand-primary/10 transition-all"
              >
                {f}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Trigger Link */}
      <div className="relative z-10 pt-6 mt-4 border-t border-dark-border/50 dark:border-white/5 flex items-center justify-between">
        <Link
          href={path}
          className="text-xs sm:text-sm font-black uppercase tracking-wider text-gray-600 group-hover:text-brand-primary dark:text-gray-500 dark:group-hover:text-brand-primary transition-all duration-300 flex items-center gap-1.5 cursor-pointer select-none"
        >
          Launch Utility
          <ArrowUpRight
            size={16}
            className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
          />
        </Link>
      </div>
    </motion.div>
  );
}
