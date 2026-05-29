import AnalyzerClient from './analyzer-client';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'SQL Query Analyzer & Performance Profiler - SQL Beast',
  description: 'Trace relational schema projections, identify nested subqueries, and retrieve engine execution warnings for your SQL queries.',
  path: '/analyzer',
});

export default function AnalyzerPage() {
  return <AnalyzerClient />;
}
