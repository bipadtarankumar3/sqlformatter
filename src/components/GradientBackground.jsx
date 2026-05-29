'use client';

import { useEffect, useState } from 'react';

export default function GradientBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-20">
      {/* Dynamic theme backdrop overlay */}
      <div className="absolute inset-0 bg-[#f9fafb]/60 dark:bg-[#07090e]/85 transition-colors duration-300" />
      
      {/* Vibrant Colorful Light Mode Meshes */}
      <div className="absolute top-[-10%] right-[-5%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-blue-400/20 to-purple-400/20 dark:from-blue-600/10 dark:to-purple-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-emerald-400/15 to-teal-400/15 dark:from-emerald-600/10 dark:to-teal-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[55vw] h-[55vw] rounded-full bg-gradient-to-tl from-rose-400/15 to-amber-400/15 dark:from-rose-600/10 dark:to-amber-600/10 blur-[130px] pointer-events-none" />
    </div>
  );
}
