'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, ChevronLeft, User, Check, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PostClient({ post, relatedPosts }) {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopyCode = async (idx, codeText) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedId(idx);
      toast.success('Snippet copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Copy failed.');
    }
  };

  // Custom micro-parser to convert standard markdown body blocks into beautiful JSX elements safely in-browser.
  const parseMarkdown = (text) => {
    if (!text) return null;
    
    const blocks = text.split('\n\n');
    let codeBlockIdx = 0;

    return blocks.map((block, idx) => {
      block = block.trim();
      if (!block) return null;

      // 1. Check for Code Block (```sql or ```javascript)
      if (block.startsWith('```')) {
        const lines = block.split('\n');
        const firstLine = lines[0];
        const lang = firstLine.replace('```', '') || 'sql';
        const codeText = lines.slice(1, lines.length - 1).join('\n');
        const currentIdx = codeBlockIdx++;

        return (
          <div key={idx} className="relative rounded-xl border border-white/5 bg-black/45 p-4 my-6 font-mono text-[10px] leading-relaxed text-gray-300 overflow-x-auto select-text group">
            <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity select-none">
              <span className="text-[8px] font-bold uppercase tracking-wider text-gray-500 bg-white/5 px-1 py-0.5 rounded">
                {lang}
              </span>
              <button
                onClick={() => handleCopyCode(currentIdx, codeText)}
                suppressHydrationWarning
                className="p-1 rounded bg-black/60 hover:bg-black text-gray-400 hover:text-white border border-white/5 cursor-pointer shrink-0"
                title="Copy Block"
              >
                {copiedId === currentIdx ? <Check size={10} className="text-brand-emerald" /> : <Copy size={10} />}
              </button>
            </div>
            {codeText}
          </div>
        );
      }

      // 2. Headings
      if (block.startsWith('### ')) {
        const textVal = block.replace('### ', '');
        const id = textVal.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        return (
          <h3 key={idx} id={id} className="font-sans font-black text-base sm:text-lg text-gray-900 dark:text-white pt-6 pb-2 border-b border-dark-border/40 dark:border-white/5 mt-8 select-none">
            {textVal}
          </h3>
        );
      }
      if (block.startsWith('#### ')) {
        const textVal = block.replace('#### ', '');
        return (
          <h4 key={idx} className="font-sans font-extrabold text-xs sm:text-sm text-gray-800 dark:text-gray-200 pt-4 pb-1 mt-6 select-none">
            {textVal}
          </h4>
        );
      }

      // 3. Bullet points list
      if (block.startsWith('- ')) {
        const lines = block.split('\n');
        return (
          <ul key={idx} className="list-disc pl-5 my-4 space-y-2 text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-sans">
            {lines.map((line, lIdx) => {
              const cleaned = line.replace(/^- /, '');
              // Inline bold check
              const parts = cleaned.split('**');
              return (
                <li key={lIdx}>
                  {parts.map((part, pIdx) => pIdx % 2 === 1 ? <strong key={pIdx} className="font-bold text-gray-800 dark:text-gray-200">{part}</strong> : part)}
                </li>
              );
            })}
          </ul>
        );
      }

      // 4. Standard Paragraph
      // Check for bold double stars **text** or inline code `code`
      const inlineParsed = block.split('**').map((part, pIdx) => {
        const isBold = pIdx % 2 === 1;
        
        // Handle inline code inside this section
        const codeSplit = part.split('`');
        const codeParsed = codeSplit.map((sub, sIdx) => {
          const isCode = sIdx % 2 === 1;
          if (isCode) {
            return <code key={sIdx} className="px-1.5 py-0.5 rounded bg-black/25 text-brand-purple font-mono text-[10px]">{sub}</code>;
          }
          return sub;
        });

        if (isBold) {
          return <strong key={pIdx} className="font-bold text-gray-900 dark:text-gray-100">{codeParsed}</strong>;
        }
        return codeParsed;
      });

      return (
        <p key={idx} className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-sans my-4">
          {inlineParsed}
        </p>
      );
    });
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-6xl mx-auto">
      
      {/* Back to Blog directory trigger */}
      <div>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-brand-primary dark:text-gray-400 dark:hover:text-brand-primary transition-colors cursor-pointer select-none"
        >
          <ChevronLeft size={14} />
          Back to Insights Blog
        </Link>
      </div>

      {/* Grid: main contents vs TOC sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Main Article pane */}
        <article className="lg:col-span-3 space-y-6">
          {/* Header Metadata */}
          <div className="space-y-4 border-b border-dark-border dark:border-white/5 pb-6 select-none">
            <span className="inline-block px-2.5 py-0.5 rounded text-[8px] font-mono font-bold bg-brand-primary/10 text-brand-primary uppercase">
              {post.category}
            </span>
            <h1 className="font-sans font-black text-2xl sm:text-4xl text-gray-900 dark:text-white leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-gray-500 font-mono pt-1">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {post.publishedAt}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {post.readingTime}
              </span>
              <span className="flex items-center gap-1">
                <User size={12} />
                By {post.author} ({post.authorRole})
              </span>
            </div>
          </div>

          {/* Renders Custom Markdown markup */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {parseMarkdown(post.content)}
          </div>
        </article>

        {/* Sidebar TOC & Related widgets */}
        <aside className="space-y-8 lg:sticky lg:top-24 self-start h-auto select-none">
          
          {/* Table of Contents pane */}
          {post.toc && post.toc.length > 0 && (
            <div className="p-5 rounded-2xl glass-panel border border-dark-border dark:border-white/5 space-y-3">
              <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {post.toc.map((tocItem) => (
                  <a
                    key={tocItem.id}
                    href={`#${tocItem.id}`}
                    className="block text-[10px] font-semibold text-gray-500 hover:text-brand-primary dark:text-gray-400 dark:hover:text-brand-primary transition-all truncate"
                  >
                    {tocItem.label}
                  </a>
                ))}
              </nav>
            </div>
          )}

          {/* Related Articles list */}
          <div className="p-5 rounded-2xl glass-panel border border-dark-border dark:border-white/5 space-y-4">
            <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-wider">
              Related Articles
            </h3>
            <div className="space-y-3.5">
              {relatedPosts.map((rp) => (
                <div key={rp.slug} className="space-y-1">
                  <Link
                    href={`/blog/${rp.slug}`}
                    className="block text-[10px] font-bold text-gray-800 dark:text-gray-200 hover:text-brand-primary dark:hover:text-brand-primary transition-colors line-clamp-2"
                  >
                    {rp.title}
                  </Link>
                  <span className="text-[8px] font-mono text-gray-500 block">
                    {rp.publishedAt} • {rp.readingTime}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </aside>

      </div>

    </div>
  );
}
