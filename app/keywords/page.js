import KeywordsClient from './keywords-client';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'SQL Keywords Explorer & Glossary - SQL Beast',
  description: 'Interactive dictionary of essential SQL keywords. Study commands (SELECT, INSERT, JOIN, CTE), structure definitions, and syntax guidelines.',
  path: '/keywords',
});

export default function KeywordsPage() {
  return <KeywordsClient />;
}
