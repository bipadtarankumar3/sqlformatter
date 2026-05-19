'use client';

import { motion } from 'framer-motion';

export default function SectionHeading({
  badge,
  title,
  description,
  align = 'center', // 'center' | 'left'
  className = '',
}) {
  const isLeft = align === 'left';

  return (
    <div className={`space-y-4 max-w-3xl ${isLeft ? 'text-left' : 'text-center mx-auto'} ${className}`}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 5 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide border border-black/[0.08] dark:border-white/10 bg-black/[0.03] dark:bg-white/5 text-gray-600 dark:text-gray-300 backdrop-blur-sm"
        >
          {badge}
        </motion.span>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-sans font-bold text-3xl sm:text-4xl tracking-tight text-gray-900 dark:text-white leading-tight"
      >
        {title}
      </motion.h2>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-sans"
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
