'use client';

import { useState, useEffect } from 'react';
import { validateSql } from '@/utils/sqlHelpers';
import SqlEditor from '@/components/SqlEditor';
import AnimatedButton from '@/components/AnimatedButton';
import SectionHeading from '@/components/SectionHeading';
import { 
  Play, Trash2, ShieldCheck, ShieldAlert, AlertTriangle, Lock
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ValidatorClient() {
  const [inputSql, setInputSql] = useState('');
  const [validationResult, setValidationResult] = useState({
    valid: true,
    issues: [],
    warnings: [],
    metrics: { length: 0, words: 0 }
  });
  const [hasChecked, setHasChecked] = useState(false);

  // Trigger validation processing
  const handleValidate = () => {
    if (!inputSql || !inputSql.trim()) {
      toast.error('Please enter a SQL query to validate.');
      return;
    }

    const result = validateSql(inputSql);
    setValidationResult(result);
    setHasChecked(true);
    
    if (result.valid && result.warnings.length === 0) {
      toast.success('SQL Check Clean! Zero issues detected.');
    } else if (!result.valid) {
      toast.error('Syntax errors discovered in your query.');
    } else {
      toast.warn('Warnings flagged in your query.');
    }
  };

  // Keyboard shortcut: Ctrl+Enter to validate
  useEffect(() => {
    const handleShortcut = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        handleValidate();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [inputSql]);

  // Real-time minor validator triggers (optional, let's make it interactive)
  useEffect(() => {
    if (inputSql) {
      const result = validateSql(inputSql);
      setValidationResult(result);
      setHasChecked(true);
    } else {
      setHasChecked(false);
      setValidationResult({ valid: true, issues: [], warnings: [], metrics: { length: 0, words: 0 } });
    }
  }, [inputSql]);

  const handleClear = () => {
    setInputSql('');
    setHasChecked(false);
    setValidationResult({ valid: true, issues: [], warnings: [], metrics: { length: 0, words: 0 } });
    toast.success('Validator workspace cleared.');
  };

  const hasErrors = validationResult.issues.length > 0;
  const hasWarnings = validationResult.warnings.length > 0;
  const isSecurityAlert = validationResult.warnings.some(w => w.type === 'security');

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Background Glowing Orb */}
      <div className="absolute top-[-10%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] rounded-full bg-gradient-to-tr from-rose-500/10 via-brand-purple/5 to-transparent blur-[120px] pointer-events-none -z-10 animate-pulse-slow" />
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <SectionHeading
          badge="Safety Guard"
          title="SQL Validator & Safety Shield"
          description="Check your SQL query against syntax anomalies and operation risk profiles instantly. Our sandbox flags catastrophic database threats locally in your browser."
          align="left"
          className="max-w-2xl"
        />
        <div className="flex gap-2">
          <AnimatedButton onClick={handleValidate} variant="primary" icon={Play}>
            Scan Query (Ctrl+Enter)
          </AnimatedButton>
          <AnimatedButton onClick={handleClear} variant="secondary" icon={Trash2}>
            Clear
          </AnimatedButton>
        </div>
      </div>

      {/* Editor & Report Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Editor panel */}
        <div className="lg:col-span-2">
          <SqlEditor
            value={inputSql}
            onChange={setInputSql}
            title="SQL Validation Sandbox"
            dialect=""
            placeholder="-- Paste SQL here to validate syntax & safety...&#10;-- Try typing DELETE FROM customers without a WHERE clause to trigger warnings!&#10;SELECT user_id, email FROM users;"
            actions={['copy', 'download', 'upload', 'clear', 'wrap']}
            onClear={handleClear}
          />
        </div>

        {/* Real-time audit reports */}
        <div className="space-y-6 flex flex-col justify-start">
          
          {/* Status Box */}
          <div className="relative rounded-2xl bg-white/40 dark:bg-[#070a10]/50 backdrop-blur-xl border border-dark-border dark:border-white/5 p-5 shadow-xl overflow-hidden group">
            
            
            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider select-none mb-3">
              Safety Shield Audit
            </h3>

            {!hasChecked ? (
              <div className="text-center py-12 text-xs text-gray-500 flex flex-col items-center justify-center gap-3">
                <div className="p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-dark-border/40 dark:border-white/10">
                  <Lock size={26} className="text-gray-400 dark:text-gray-500 animate-pulse" />
                </div>
                <p className="font-bold text-gray-700 dark:text-gray-300">Safety scanner standby.</p>
                <p className="text-[10px] text-gray-400">Type or paste a query to begin auditing.</p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* 1. Syntax Valid State */}
                <div className={`p-4 rounded-xl flex items-start gap-3 border transition-all duration-300 ${
                  hasErrors 
                    ? 'border-brand-rose/25 bg-brand-rose/10 text-brand-rose' 
                    : 'border-brand-emerald/25 bg-brand-emerald/10 text-brand-emerald'
                }`}>
                  {hasErrors ? <ShieldAlert size={20} className="shrink-0 animate-bounce" /> : <ShieldCheck size={20} className="shrink-0" />}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide">
                      {hasErrors ? 'Syntax Errors Detected' : 'Syntax Check Passed'}
                    </h4>
                    <p className="text-[11px] mt-1 leading-normal text-gray-700 dark:text-gray-300">
                      {hasErrors 
                        ? `Captured ${validationResult.issues.length} structural queries failure. Correct before deploying.` 
                        : 'Query complies with fundamental parsing structure. Parentheses and quotes matched.'}
                    </p>
                  </div>
                </div>

                {/* 2. Security warning summary */}
                <div className={`p-4 rounded-xl flex items-start gap-3 border transition-all duration-300 ${
                  isSecurityAlert 
                    ? 'border-brand-rose/25 bg-brand-rose/15 text-brand-rose animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.1)]' 
                    : hasWarnings 
                      ? 'border-yellow-500/25 bg-yellow-500/10 text-yellow-600 dark:text-yellow-500' 
                      : 'border-brand-primary/25 bg-brand-primary/10 text-brand-primary'
                }`}>
                  {isSecurityAlert ? (
                    <ShieldAlert size={20} className="shrink-0" />
                  ) : hasWarnings ? (
                    <AlertTriangle size={20} className="shrink-0" />
                  ) : (
                    <ShieldCheck size={20} className="shrink-0" />
                  )}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wide">
                      {isSecurityAlert 
                        ? 'CRITICAL OPERATION THREAT' 
                        : hasWarnings 
                          ? 'Operational Warnings' 
                          : 'Safety Guards Clear'}
                    </h4>
                    <p className="text-[11px] mt-1 leading-normal text-gray-700 dark:text-gray-300">
                      {isSecurityAlert 
                        ? 'Destructive query detected! Exclude operations or review clause limitations.' 
                        : hasWarnings 
                          ? `Query flagged ${validationResult.warnings.length} execution advisory warnings.` 
                          : 'Zero operation locks or unsafe updates identified. Low risk profile.'}
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 pt-2 border-t border-dark-border/40 dark:border-white/5 select-none">
                  <span>Characters: {validationResult.metrics.length}</span>
                  <span>Words: {validationResult.metrics.words}</span>
                </div>

              </div>
            )}
          </div>

          {/* Warnings List logs */}
          {hasChecked && (hasErrors || hasWarnings) && (
            <div className="relative rounded-2xl bg-white/40 dark:bg-[#070a10]/50 backdrop-blur-xl border border-dark-border dark:border-white/5 p-5 shadow-xl overflow-hidden flex flex-col max-h-[300px]">
              
              
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider select-none mb-3">
                Issues Log ({validationResult.issues.length + validationResult.warnings.length})
              </h3>
              <div className="overflow-y-auto flex-1 space-y-2.5 pr-1 custom-scrollbar">
                {/* Syntax Errors */}
                {validationResult.issues.map((issue, idx) => (
                  <div key={`err-${idx}`} className="text-[10px] p-2.5 rounded-xl bg-brand-rose/10 border border-brand-rose/20 border-l-2 border-l-brand-rose text-brand-rose leading-relaxed font-mono">
                    <strong>Syntax Error:</strong> {issue.message}
                  </div>
                ))}
                {/* Warnings */}
                {validationResult.warnings.map((warn, idx) => (
                  <div 
                    key={`warn-${idx}`} 
                    className={`text-[10px] p-2.5 rounded-xl border border-l-2 leading-relaxed font-mono ${
                      warn.severity === 'high' 
                        ? 'bg-brand-rose/10 border-brand-rose/20 border-l-brand-rose text-brand-rose' 
                        : 'bg-yellow-500/10 border-yellow-500/20 border-l-yellow-500 text-yellow-600 dark:text-yellow-500'
                    }`}
                  >
                    <strong>{warn.severity === 'high' ? 'CRITICAL RISK:' : 'WARN:'}</strong> {warn.message}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* active validator checklist card */}
      <section className="relative p-6 rounded-2xl bg-white/40 dark:bg-[#070a10]/50 backdrop-blur-xl border border-dark-border dark:border-white/5 shadow-xl overflow-hidden group z-10">
        
        
        <div className="flex items-center gap-2.5">
          <ShieldCheck size={20} className="text-brand-emerald" />
          <h3 className="font-sans font-bold text-sm text-gray-800 dark:text-white">Active Validator Protections</h3>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-sans max-w-3xl mt-2">
          SQL Beast executes real-time semantic analysis to identify potential query risks. These guards run locally to block execution of unconstrained statements, locked procedures, or schema rewrites in production.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="p-3.5 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/5 hover:border-brand-primary/20 transition-all duration-300 space-y-1">
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wide">Bracket Matching</span>
            <p className="text-[10px] text-gray-500 leading-normal">Verifies matching quotes (&apos;, &ldquo;) and open/close parentheses to resolve immediate compiler errors.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/5 hover:border-brand-primary/20 transition-all duration-300 space-y-1">
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wide">Wipeout Shield</span>
            <p className="text-[10px] text-gray-500 leading-normal">Flags delete operations lacking explicit matching filter arguments (DELETE FROM without WHERE clauses).</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/5 hover:border-brand-primary/20 transition-all duration-300 space-y-1">
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wide">Schema Mutations</span>
            <p className="text-[10px] text-gray-500 leading-normal">Flags DROP or TRUNCATE operations, warning about permanent table removals and immediate index collapses.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-white/50 dark:bg-black/20 border border-slate-200 dark:border-white/5 hover:border-brand-primary/20 transition-all duration-300 space-y-1">
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-wide">Syntax Termination</span>
            <p className="text-[10px] text-gray-500 leading-normal">Checks for missing separating semicolons to confirm clean SQL dialect separation standards.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
