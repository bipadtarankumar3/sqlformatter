import SectionHeading from '@/components/SectionHeading';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'Terms of Service - SQL Beast',
  description: 'Read the terms of use for SQL Beast. Entirely free, open-source, client-side SQL utilities.',
  path: '/terms',
});

export default function TermsOfService() {
  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto leading-relaxed font-sans text-xs sm:text-sm text-gray-600 dark:text-gray-400">
      
      {/* Title */}
      <SectionHeading
        badge="Legal Docs"
        title="Terms of Service"
        description="Effective Date: May 18, 2026. Review our terms of use. SQL Beast is completely free, open-source, and provided 'as-is' for educational and developer utilities."
        align="left"
      />

      <div className="space-y-6">
        <section className="space-y-2">
          <h3 className="font-sans font-black text-sm sm:text-base text-gray-900 dark:text-white">1. Acceptance of Terms</h3>
          <p>
            By accessing or utilizing SQL Beast (located at sqlbeast.dev or running locally), you acknowledge and agree to comply with these Terms of Service and our Privacy Policy. If you do not accept these parameters, please do not use our utilities.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-sans font-black text-sm sm:text-base text-gray-900 dark:text-white">2. Open Source & License</h3>
          <p>
            SQL Beast is made available under standard permissive open-source terms. You are free to view, copy, fork, and run this application locally for personal or commercial development pipelines. All core formatting and validation engines are licensed under standard MIT or Apache parameters.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-sans font-black text-sm sm:text-base text-gray-900 dark:text-white">3. Acceptable Use</h3>
          <p>
            Since all operations run client-side in your own browser sandbox, you are solely responsible for query safety and deployment operations. You agree not to attempt to inject exploit code, execute denial-of-service blockages, or abuse our web hosting configurations.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-sans font-black text-sm sm:text-base text-gray-900 dark:text-white">4. Disclaimer of Warranties</h3>
          <p className="bg-black/10 dark:bg-white/[0.01] p-3 rounded-lg border border-dark-border dark:border-white/5 font-mono text-[10px]">
            THE UTILITY SUITE IS PROVIDED &ldquo;AS IS&rdquo; WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
          </p>
        </section>

        <section className="space-y-2">
          <h3 className="font-sans font-black text-sm sm:text-base text-gray-900 dark:text-white">5. Limit of Liability</h3>
          <p>
            SQL Beast does not execute queries directly against active live production servers; we only provide formatting text modifications and regex-based threat recommendations. Under no circumstances shall SQL Beast be held responsible for accidental data deletions, database locks, or schema outages resulting from your direct query execution.
          </p>
        </section>
      </div>

    </div>
  );
}
