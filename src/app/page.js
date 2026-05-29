import HomeClient from './home-client';
import { getMetadata, getJsonLdSchema } from '@/utils/seo';

export const metadata = getMetadata({
  title: 'SQL Beast - Premium SQL Formatter, Beautifier & Query Analyzer',
  description: 'The ultimate online developer-focused SQL platform. Format, beautify, minify, validate, and analyze your SQL queries instantly. Supports MySQL, PostgreSQL, SQLite, MariaDB, and Oracle.',
  path: '/',
});

export default function HomePage() {
  const schema = getJsonLdSchema('WebSite');

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      <HomeClient />
    </>
  );
}
