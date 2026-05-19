'use client';

import { useState } from 'react';
import SectionHeading from '@/components/SectionHeading';
import AnimatedButton from '@/components/AnimatedButton';
import { Mail, MessageSquare, Send, CheckCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'Feature Request',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    
    // Simulate submission latency
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Message sent! Thank you for your feedback.');
      setFormData({ name: '', email: '', topic: 'Feature Request', message: '' });
    }, 1200);
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">
      
      {/* Title */}
      <SectionHeading
        badge="Get in Touch"
        title="Contact & Feedback Support"
        description="Found a bug, want to suggest formatting improvements, or discuss collaboration? Send us a message and our engineering team will review it."
      />

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        
        {/* Support information column */}
        <div className="md:col-span-2 space-y-6">
          <div className="p-5 rounded-2xl glass-panel border border-dark-border dark:border-white/5 space-y-4">
            <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-wider select-none">
              Developer Support
            </h3>
            
            <div className="space-y-4 font-sans text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              <div className="flex gap-3">
                <Mail size={16} className="text-brand-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Email Address</h4>
                  <p className="text-[10px]">support@sqlbeast.dev</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <MessageSquare size={16} className="text-brand-purple shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-white">Open Source Community</h4>
                  <p className="text-[10px]">Submit PRs or issues directly on GitHub.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-dark-border dark:border-white/5 space-y-2 text-[10px] leading-normal text-gray-500 font-sans">
            <div className="flex items-center gap-1.5 text-brand-primary font-bold uppercase mb-1">
              <Info size={12} />
              <span>Offline Capabilities</span>
            </div>
            <p>
              Remember, SQL Beast runs 100% locally. If you run into formatting syntax failures, please include the SQL script structure in your bug report so we can improve parser rules.
            </p>
          </div>
        </div>

        {/* Contact Form Column */}
        <div className="md:col-span-3">
          <div className="p-6 rounded-2xl glass-panel border border-dark-border dark:border-white/5">
            {submitted ? (
              <div className="text-center py-12 space-y-4 animate-fade-in select-none">
                <CheckCircle size={40} className="text-brand-emerald mx-auto" />
                <h3 className="font-sans font-black text-sm sm:text-base">Message Transmitted Successfully</h3>
                <p className="text-[10px] text-gray-500 max-w-sm mx-auto leading-normal">
                  Thank you for helping us make SQL Beast better. Our database tools maintenance team will review your comments.
                </p>
                <AnimatedButton onClick={() => setSubmitted(false)} variant="secondary" className="text-[10px]">
                  Send Another Message
                </AnimatedButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Linus Torvalds"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-dark-border dark:border-white/10 bg-black/10 dark:bg-white/5 text-gray-800 dark:text-gray-200 outline-none placeholder-gray-500"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. linus@kernel.org"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-dark-border dark:border-white/10 bg-black/10 dark:bg-white/5 text-gray-800 dark:text-gray-200 outline-none placeholder-gray-500"
                  />
                </div>

                {/* Topic selection */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Topic Classification</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-dark-border dark:border-white/10 bg-black/10 dark:bg-white/5 text-gray-750 dark:text-gray-200 outline-none"
                  >
                    <option value="Bug Report">Format / Syntax Bug Report</option>
                    <option value="Feature Request">New Feature Request</option>
                    <option value="Collaboration">Collaboration / Open Source</option>
                    <option value="General">General Question</option>
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Message Body *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Provide details about your query or bug experience..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-dark-border dark:border-white/10 bg-black/10 dark:bg-white/5 text-gray-800 dark:text-gray-200 outline-none placeholder-gray-500 resize-none"
                  />
                </div>

                {/* Submit button */}
                <AnimatedButton 
                  type="submit" 
                  variant="primary" 
                  className="w-full text-xs" 
                  disabled={loading}
                  icon={Send}
                >
                  {loading ? 'Transmitting Message...' : 'Send Message'}
                </AnimatedButton>

              </form>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
