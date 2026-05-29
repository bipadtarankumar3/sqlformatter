import ExamplesClient from './examples-client';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'SQL Examples Gallery & Dialect Templates - SQL Beast',
  description: 'Explore template scripts for PostgreSQL, MySQL, and SQLite. Copy pre-built queries or load them directly into the SQL formatter tool.',
  path: '/examples',
});

export default function ExamplesPage() {
  return <ExamplesClient />;
}
