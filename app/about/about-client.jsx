'use client';

import SectionHeading from '@/components/SectionHeading';
import { ShieldCheck, Cpu, Code2, Globe, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutClient() {
  const values = [
    {
      title: 'Privacy First',
      desc: 'We enforce absolute privacy. All syntax inspections, formats, and minifications run entirely in your local browser sandbox. Your database code never hits an external cloud server.',
      icon: ShieldCheck
    },
    {
      title: 'Visual Excellence',
      desc: 'We believe developer tools should be beautiful. We curate harmonious palettes, glassmorphic filters, and JetBrains Mono line alignments to create a premium experience.',
      icon: Code2
    },
    {
      title: 'High Performance',
      desc: 'No heavy backend lag. Our utilities leverage lightweight regular expression scanners and optimized client parsing libraries to compile reports in milliseconds.',
      icon: Cpu
    },
    {
      title: 'Community Driven',
      desc: 'SQL Beast is created by developers, for developers. We keep all core utilities open, free, and free of paywalls, cookie-trackers, or advertisement popups.',
      icon: Globe
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 animate-fade-in max-w-5xl mx-auto">
      
      {/* Title Hero */}
      <SectionHeading
        badge="About Us"
        title="Our Vision for Database Tooling"
        description="We believe database engineering requires visual clarity, absolute data privacy, and blistering speed. We build modern, client-side tools that fit seamlessly into your workflow."
      />

      {/* Brand Narrative Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-gray-600 dark:text-gray-400 font-sans">
          <h3 className="font-sans font-black text-sm sm:text-base text-gray-900 dark:text-white">
            Why we built SQL Beast
          </h3>
          <p>
            As fullstack engineers and database administrators, we spent hours copy-pasting messy SQL query logs, formatting query definitions manually, and running risk evaluations. Many online formatting sites were cluttered with ads, slow servers, or questionable privacy policies.
          </p>
          <p>
            We designed SQL Beast to solve these issues. A stunning developer suite inspired by Vercel and Raycast, providing full query formatting controls, compression calculators, safety shields, and analytical traces—entirely offline and client-side.
          </p>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-dark-border dark:border-white/5 space-y-3.5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-brand-primary/10 blur-xl" />
          <Award className="text-brand-primary" size={24} />
          <h4 className="font-sans font-bold text-xs sm:text-sm text-gray-800 dark:text-white">Our Quality Standards</h4>
          <p className="text-[10px] text-gray-500 leading-normal font-sans">
            Every line of code inside SQL Beast is optimized for minimal package footprints, accessible contrast scales, and zero server network latency. Your workspace configuration and favorites are cached securely in local browser storage, and nowhere else.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest">Philosophy</span>
          <h3 className="text-sm sm:text-base font-extrabold text-gray-900 dark:text-white mt-1">Core Operations Pillars</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {values.map((v, idx) => {
            const Icon = v.icon;
            return (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="p-5 rounded-2xl glass-card border border-dark-border dark:border-white/5 flex items-start gap-4"
              >
                <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary shrink-0">
                  <Icon size={18} />
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-sans font-bold text-xs sm:text-sm text-gray-800 dark:text-white">{v.title}</h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-sans">{v.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
