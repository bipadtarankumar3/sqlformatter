import BlogClient from './blog-client';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'Database Insights Blog & Optimization Guides - SQL Beast',
  description: 'Deep dive articles on SQL syntax rules, indexing engines, performance tuning, and query auditing best practices.',
  path: '/blog',
});

export default function BlogPage() {
  return <BlogClient />;
}
