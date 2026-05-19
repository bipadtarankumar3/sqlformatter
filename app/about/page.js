import AboutClient from './about-client';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'About Us - Our Vision for Developer Tools',
  description: 'Learn why we built SQL Beast. Free, beautiful, high-performance database formatting tools running entirely client-side.',
  path: '/about',
});

export default function AboutPage() {
  return <AboutClient />;
}
