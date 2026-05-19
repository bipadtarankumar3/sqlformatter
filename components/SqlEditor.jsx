'use client';

import { useState, useRef, useEffect } from 'react';
import { useSqlStore } from '@/store/sqlStore';
import { Copy, Check, Download, Upload, Trash2, Maximize2, WrapText } from 'lucide-react';
import toast from 'react-hot-toast';
import { highlightSql } from '@/utils/sqlHelpers';

export default function SqlEditor({
  value = '',
  onChange,
  readOnly = false,
  placeholder = 'SELECT * FROM users WHERE status = \'active\';',
  title = 'SQL Query Input',
  dialect = 'PostgreSQL',
  actions = ['copy', 'download', 'clear'], // 'copy', 'download', 'upload', 'clear', 'wrap'
  onClear,
}) {
  const { wordWrap, setWordWrap } = useSqlStore();
  const [copied, setCopied] = useState(false);
  const [lines, setLines] = useState([1]);

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const fileInputRef = useRef(null);
  const highlightOverlayRef = useRef(null);

  // Re-calculate line counts when value changes
  useEffect(() => {
    const lineCount = value.split('\n').length;
    setLines(Array.from({ length: Math.max(1, lineCount) }, (_, i) => i + 1));
  }, [value]);

  // Synchronize scrolling between line numbers, textarea, and highlight overlay
  const handleScroll = () => {
    if (textareaRef.current) {
      const scrollTop = textareaRef.current.scrollTop;
      const scrollLeft = textareaRef.current.scrollLeft;
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
      if (highlightOverlayRef.current) {
        highlightOverlayRef.current.scrollTop = scrollTop;
        highlightOverlayRef.current.scrollLeft = scrollLeft;
      }
    }
  };

  // Synchronize scrolling for read-only pre block
  const handlePreScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop;
    }
  };

  // Trigger clipboard copy action
  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success('SQL copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy text.');
    }
  };

  // Trigger file download
  const handleDownload = () => {
    if (!value) return;
    try {
      const blob = new Blob([value], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `query_${Date.now()}.sql`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('SQL file downloaded!');
    } catch (err) {
      toast.error('Download failed.');
    }
  };

  // Trigger file upload from local machine
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        onChange(text);
        toast.success(`Successfully uploaded ${file.name}`);
      }
    };
    reader.onerror = () => {
      toast.error('Error reading file.');
    };
    reader.readAsText(file);
  };

  const lineCount = value ? value.split('\n').length : 0;
  const charCount = value ? value.length : 0;

  return (
    <div className="flex flex-col w-full rounded-[2rem] border border-slate-200/80 dark:border-white/5 bg-white/90 dark:bg-[#0b0e14]/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-2xl overflow-hidden h-[340px] sm:h-[400px] md:h-[480px] backdrop-blur-xl text-left">
      
      {/* Editor Header Panel */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-2.5 sm:py-3.5 bg-slate-50/50 dark:bg-black/35 border-b border-slate-100 dark:border-white/5 shrink-0 select-none backdrop-blur-md">
        
        {/* Title & Dialect Badge */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide font-sans">{title}</span>
          {dialect && (
            <span className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-mono tracking-widest font-bold bg-brand-primary/10 text-brand-primary uppercase">
              {dialect}
            </span>
          )}
        </div>

        {/* Action Panel Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Wrap Toggle */}
          {actions.includes('wrap') && (
            <button
              onClick={() => setWordWrap(!wordWrap)}
              className={`p-1 sm:p-1.5 rounded-lg border text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-205 cursor-pointer transition-all ${
                wordWrap 
                  ? 'border-brand-primary/30 bg-brand-primary/10 text-brand-primary' 
                  : 'border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
              title="Toggle Word Wrap"
            >
              <WrapText size={11} className="sm:w-3 sm:h-3" />
            </button>
          )}

          {/* Upload Button */}
          {actions.includes('upload') && !readOnly && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".sql,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={handleUploadClick}
                className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer transition-all"
                title="Upload SQL File"
              >
                <Upload size={11} className="sm:w-3 sm:h-3" />
              </button>
            </>
          )}

          {/* Clear Button */}
          {actions.includes('clear') && !readOnly && onClear && (
            <button
              onClick={onClear}
              className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-white/5 hover:bg-rose-50 dark:hover:bg-brand-rose/20 text-slate-500 dark:text-slate-400 hover:text-brand-rose cursor-pointer transition-all"
              title="Clear Editor"
            >
              <Trash2 size={11} className="sm:w-3 sm:h-3" />
            </button>
          )}

          {/* Download Button */}
          {actions.includes('download') && (
            <button
              onClick={handleDownload}
              disabled={!value}
              className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              title="Download SQL File"
            >
              <Download size={11} className="sm:w-3 sm:h-3" />
            </button>
          )}

          {/* Copy Button */}
          {actions.includes('copy') && (
            <button
              onClick={handleCopy}
              disabled={!value}
              className="p-1 sm:p-1.5 rounded-lg border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all"
              title="Copy to Clipboard"
            >
              {copied ? <Check size={11} className="text-brand-emerald sm:w-3 sm:h-3" /> : <Copy size={11} className="sm:w-3 sm:h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Editor Body Text Area */}
      <div className="flex flex-1 overflow-hidden relative text-left">
        
        {/* Line Numbers Sidebar */}
        <div
          ref={lineNumbersRef}
          className="w-10 sm:w-12 bg-slate-50/30 dark:bg-black/10 border-r border-slate-100/50 dark:border-white/5 select-none text-right pr-2 sm:pr-3 pt-3 sm:pt-5 font-mono text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 overflow-hidden leading-5 sm:leading-6"
        >
          {lines.map((ln) => (
            <div key={ln}>{ln}</div>
          ))}
        </div>

        {readOnly ? (
          /* Read Only Mode: Render pure pre-code block with syntax highlighting */
          <pre
            onScroll={handlePreScroll}
            className={`flex-1 p-3 sm:p-5 bg-transparent font-mono text-xs sm:text-sm leading-5 sm:leading-6 outline-none overflow-auto custom-scrollbar select-text text-left ${
              wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
            }`}
            dangerouslySetInnerHTML={{ __html: highlightSql(value) || `<span class="text-slate-400/60 dark:text-slate-600">${placeholder}</span>` }}
          />
        ) : (
          /* Editable Mode: Overlay textarea on top of highlighted pre-block */
          <div className="flex-1 relative overflow-hidden text-left">
            {/* Highlighted text container underneath */}
            <pre
              ref={highlightOverlayRef}
              className={`absolute inset-0 p-3 sm:p-5 bg-transparent font-mono text-xs sm:text-sm leading-5 sm:leading-6 pointer-events-none overflow-hidden select-none text-left ${
                wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
              }`}
              style={{ margin: 0, border: 0 }}
              dangerouslySetInnerHTML={{ __html: highlightSql(value) }}
            />
            {/* Invisible cursor/textarea on top */}
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange && onChange(e.target.value)}
              onScroll={handleScroll}
              placeholder={placeholder}
              spellCheck={false}
              className={`absolute inset-0 p-3 sm:p-5 bg-transparent font-mono text-xs sm:text-sm leading-5 sm:leading-6 outline-none resize-none overflow-auto editor-textarea text-left ${
                wordWrap ? 'whitespace-pre-wrap break-all' : 'whitespace-pre'
              } ${value ? 'text-transparent' : 'text-slate-800 dark:text-slate-100'}`}
              style={{
                caretColor: 'var(--color-brand-primary, #6366f1)',
              }}
            />
          </div>
        )}
      </div>

      {/* Editor Status/Metrics Footer */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-2 bg-slate-50/50 dark:bg-black/20 border-t border-slate-100 dark:border-white/5 text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0 select-none backdrop-blur-md">
        <div>
          <span>Lines: {lineCount}</span>
          <span className="mx-2">|</span>
          <span>Chars: {charCount}</span>
        </div>
        <div>
          <span>Press {readOnly ? 'Copy' : 'Ctrl+Enter to format'}</span>
        </div>
      </div>
    </div>
  );
}
