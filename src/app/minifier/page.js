import MinifierClient from './minifier-client';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'SQL Minifier & Compressor - Shrink SQL Query Payloads',
  description: 'Condense heavy SQL queries, transaction scripts, and schemas into compact strings. Strip comments, delimiters, and spaces instantly.',
  path: '/minifier',
});

export default function MinifierPage() {
  return <MinifierClient />;
}
