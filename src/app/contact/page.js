import ContactClient from './contact-client';
import { getMetadata } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'Contact Support & Feedback - SQL Beast',
  description: 'Reach out to the SQL Beast support team. Send feature suggestions, format parser bugs, or query analyzer feedback.',
  path: '/contact',
});

export default function ContactPage() {
  return <ContactClient />;
}
