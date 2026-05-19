'use client';

import { motion } from 'framer-motion';

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  iconColor = 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20 dark:text-brand-primary/95',
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`relative p-6 rounded-3xl bg-white/40 dark:bg-[#070a10]/60 backdrop-blur-xl border border-dark-border dark:border-white/5 shadow-lg flex flex-col items-start gap-4 overflow-hidden group hover:border-brand-primary/30 hover:shadow-[0_0_30px_rgba(20,184,166,0.1)] transition-all ${className}`}
    >
      {/* Background Image */}
      <img src="/card_bg.png" alt="Card Background" className="absolute inset-0 w-full h-full object-cover opacity-[0.03] dark:opacity-[0.1] pointer-events-none mix-blend-overlay" />
      
      {/* Background Glowing Hover Orb */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-brand-primary/20 to-transparent blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Icon Badge with dynamic coloring */}
      <div className={`relative z-10 p-3.5 rounded-2xl flex items-center justify-center shrink-0 border border-current/20 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_15px_currentColor] ${iconColor}`}>
        <Icon size={20} className="transform group-hover:rotate-12 transition-transform duration-300" />
      </div>

      {/* Details */}
      <div className="space-y-2 relative z-10">
        <h3 className="font-sans font-extrabold text-base sm:text-lg text-gray-900 dark:text-gray-100 tracking-tight group-hover:text-brand-primary transition-colors">
          {title}
        </h3>
        <p className="font-sans text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
