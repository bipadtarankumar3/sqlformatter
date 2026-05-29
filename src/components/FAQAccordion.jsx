'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3.5">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="rounded-2xl border border-dark-border bg-white/20 dark:border-white/5 dark:bg-[#0e131f]/40 backdrop-blur-md overflow-hidden transition-all duration-200"
          >
            {/* Header Trigger */}
            <button
              onClick={() => toggleIndex(index)}
              suppressHydrationWarning
              className="w-full flex items-center justify-between p-4 text-left cursor-pointer select-none"
            >
              <span className="font-sans font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200 pr-4">
                {item.question}
              </span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="p-1 rounded-lg bg-black/5 dark:bg-white/5 text-gray-400 shrink-0"
              >
                <ChevronDown size={14} />
              </motion.div>
            </button>

            {/* Expandable Content wrapper */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                >
                  <div className="px-4 pb-4 pt-1 border-t border-dark-border/50 dark:border-white/5 text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
