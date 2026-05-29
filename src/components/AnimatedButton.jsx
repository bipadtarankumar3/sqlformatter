'use client';

import { motion } from 'framer-motion';

export default function AnimatedButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'ghost' | 'danger'
  disabled = false,
  className = '',
  icon: Icon,
  iconPosition = 'left', // 'left' | 'right'
}) {
  const baseStyles = 'relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wide transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none outline-none overflow-hidden';

  const variants = {
    primary: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 text-white shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20 active:brightness-95 bg-[length:200%_auto]',
    secondary: 'border border-dark-border dark:border-white/10 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200',
    ghost: 'bg-transparent text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-black/5 dark:hover:bg-white/5',
    danger: 'bg-gradient-to-r from-brand-rose to-red-600 text-white shadow-md shadow-brand-rose/10 hover:shadow-brand-rose/20 active:brightness-95',
  };

  const motionProps = variant === 'primary' && !disabled
    ? {
        animate: {
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        },
        transition: {
          backgroundPosition: {
            repeat: Infinity,
            duration: 4,
            ease: 'linear',
          },
          scale: {
            type: 'spring',
            stiffness: 500,
            damping: 25,
          }
        }
      }
    : {
        transition: { type: 'spring', stiffness: 500, damping: 25 }
      };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      suppressHydrationWarning
      whileHover={{ scale: disabled ? 1 : 1.025 }}
      whileTap={{ scale: disabled ? 1 : 0.975 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...motionProps}
    >
      {/* Shimmer wave effect */}
      {variant === 'primary' && !disabled && (
        <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          <motion.span
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent"
            initial={{ left: '-100%' }}
            animate={{ left: '150%' }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 2.0,
              ease: 'easeInOut',
              repeatDelay: 1.0,
            }}
          />
        </span>
      )}

      {/* Content wrapper to stay on top of shimmer */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {Icon && iconPosition === 'left' && <Icon size={14} className="shrink-0" />}
        {children}
        {Icon && iconPosition === 'right' && <Icon size={14} className="shrink-0" />}
      </span>
    </motion.button>
  );
}
