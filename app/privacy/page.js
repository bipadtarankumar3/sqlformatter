import SectionHeading from '@/components/SectionHeading';
import { ShieldCheck } from 'lucide-react';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'Privacy Policy - SQL Beast',
  description: 'Understand how SQL Beast handles your data. 100% offline, local browser processing, no server connections.',
  path: '/privacy',
});

export default function PrivacyPolicy() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto leading-relaxed font-sans text-xs sm:text-sm text-gray-600 dark:text-gray-400">
      
      {/* Title */}
      <SectionHeading
        badge="Legal Docs"
        title="Privacy Policy"
        description="Effective Date: May 18, 2026. Learn why SQL Beast is 100% secure, offline-safe, and runs completely in your browser without cloud dependencies."
        align="left"
      />

      <div className="p-4 rounded-xl border border-brand-emerald/20 bg-brand-emerald/10 text-brand-emerald flex items-start gap-3 select-none">
        <ShieldCheck size={20} className="shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold tracking-wide uppercase text-[10px] mb-0.5">Absolute Privacy Shield</strong>
          <p className="text-[11px] leading-normal text-gray-700 dark:text-gray-300">
            SQL Beast processes all SQL statements entirely inside your local browser instance. We do not transmit queries, table schemas, or keys to any remote servers. Your data is 100% secure.
          </p>
        </div>
      </div>

      <div className="space-y-6 pt-4">
        <section className="space-y-2">
          <h3 className="font-sans font-black text-sm sm:text-base text-gray-900 dark:text-white">1. Data Processing and Collection</h3>
          <p>
            SQL Beast does not establish server-side databases to store, log, or track user query inputs. When you format, validate, minify, or analyze a SQL statement, the operations are compiled locally using browser-side JavaScript libraries.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-sans font-black text-sm sm:text-base text-gray-900 dark:text-white">2. Local Storage Usage</h3>
          <p>
            To enhance your playground experience, SQL Beast utilizes your browser&apos;s standard <code className="px-1.5 py-0.5 rounded bg-black/25 text-brand-purple font-mono text-xs">localStorage</code> to save:
          </p>
          <ul className="list-disc pl-5 space-y-1 my-2">
            <li>Your recent 20 formatted queries (workspace history).</li>
            <li>Your customized favorites database query list.</li>
            <li>Your formatting preferences (dialects, casing options, indent tabs).</li>
            <li>Your design theme setting (dark/light mode).</li>
          </ul>
          <p>
            This data remains completely under your control and can be deleted instantly by clearing your browser cache or clicking the &ldquo;Clear History&rdquo; action inside the Command Palette.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-sans font-black text-sm sm:text-base text-gray-900 dark:text-white">3. Third-Party Analytics</h3>
          <p>
            We do not load third-party ad networks, tracking pixels, or data collection cookies. We run minimal, privacy-compliant telemetry simply to measure aggregate page visits without tracking individual user parameters or logging query contents.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-sans font-black text-sm sm:text-base text-gray-900 dark:text-white">4. Updates and Inquiries</h3>
          <p>
            We may review this Privacy Policy from time to time as browser standards or new SQL dialects roll out. For privacy questions or validation checks, please contact our support team at <strong className="text-gray-800 dark:text-gray-200">support@sqlbeast.dev</strong>.
          </p>
        </section>
      </div>

    </div>
  );
}
