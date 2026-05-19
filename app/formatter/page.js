'use client';

import FormatterWidget from '@/components/FormatterWidget';

export default function Formatter() {
  return (
    <div className="relative">
       {/* Background Glowing Orb */}
       <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-gradient-to-tr from-brand-primary/10 via-brand-purple/5 to-transparent blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
       
      <FormatterWidget />
    </div>
  );
}
