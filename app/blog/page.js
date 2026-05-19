'use client';

import Link from 'next/link';
import SectionHeading from '@/components/SectionHeading';
import { blogPosts } from '@/utils/blogData';
import { BookOpen, Calendar, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BlogIndex() {
  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* Title */}
      <SectionHeading
        badge="Insights"
        title="SQL Beast Developer Blog"
        description="Deep dives into relational databases, indexing structures, query optimizations, safety configurations, and database engine algorithms."
      />

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {blogPosts.map((post, idx) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="flex flex-col justify-between p-6 rounded-2xl glass-card border border-dark-border dark:border-white/5 h-full group"
          >
            <div className="space-y-4">
              
              {/* Category, Date & Read time */}
              <div className="flex flex-wrap items-center gap-2 text-[8px] font-mono font-bold text-gray-500">
                <span className="px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary uppercase">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={10} />
                  {post.publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={10} />
                  {post.readingTime}
                </span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <Link href={`/blog/${post.slug}`} className="cursor-pointer">
                  <h3 className="font-sans font-black text-sm sm:text-base text-gray-800 dark:text-white group-hover:text-brand-primary transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3">
                  {post.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 pt-1 select-none">
                {post.tags.map((tag) => (
                  <span key={tag} className="px-1.5 py-0.5 rounded text-[8px] font-mono bg-black/5 dark:bg-white/5 text-gray-400">
                    #{tag}
                  </span>
                ))}
              </div>

            </div>

            {/* Read action */}
            <div className="pt-6 mt-4 border-t border-dark-border/50 dark:border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                By <strong className="text-gray-700 dark:text-gray-300 font-semibold">{post.author}</strong>
              </span>
              <Link
                href={`/blog/${post.slug}`}
                className="text-[10px] font-bold text-brand-primary flex items-center gap-1 hover:underline cursor-pointer"
              >
                Read Article
                <ArrowRight size={10} className="transform group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
}
