import CheatSheetClient from './cheatsheet-client';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'SQL Cheat Sheet & Syntax Reference Manual - SQL Beast',
  description: 'Quick reference guide for common SQL operations. Standard definitions, JOINS diagrams, aggregation HAVING methods, window partitions, and index structures.',
  path: '/cheatsheet',
});

export default function CheatSheetPage() {
  return <CheatSheetClient />;
}
