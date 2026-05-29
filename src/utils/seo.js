/**
 * SEO helper functions for SQL Beast
 */

export const siteConfig = {
  name: 'SQL Beast',
  title: 'SQL Beast - Premium SQL Formatter, Beautifier & Query Analyzer',
  description: 'The ultimate online developer-focused SQL platform. Format, beautify, minify, validate, and analyze your SQL queries instantly. Supports MySQL, PostgreSQL, SQLite, MariaDB, and Oracle.',
  url: 'https://sqlformatter.revoxera.com',
  ogImage: '/logo.png',
  twitterHandle: '@revoxera',
};

/**
 * Returns structured metadata object for Next.js App Router metadata export.
 */
export const getMetadata = ({
  title,
  description,
  path = '',
  keywords = [],
  ogType = 'website',
  publishedTime,
} = {}) => {
  const pageTitle = title ? `${title} | SQL Beast` : siteConfig.title;
  const pageDesc = description || siteConfig.description;
  const pageUrl = `${siteConfig.url}${path}`;

  const meta = {
    title: pageTitle,
    description: pageDesc,
    keywords: [
      'sql formatter',
      'sql beautifier',
      'sql minifier',
      'sql validator',
      'sql query analyzer',
      'sql cheatsheet',
      'developer tools',
      'sql parser',
      'postgres formatter',
      'mysql formatter',
      ...keywords,
    ],
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: pageTitle,
      description: pageDesc,
      url: pageUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: 'SQL Beast - Ultimate SQL Utilities Suite',
        },
      ],
      locale: 'en_US',
      type: ogType,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDesc,
      creator: siteConfig.twitterHandle,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/logo.png',
    },
  };

  if (publishedTime) {
    meta.openGraph.publishedTime = publishedTime;
  }

  return meta;
};

/**
 * Generates JSON-LD schema markup for SEO indexing.
 */
export const getJsonLdSchema = (type, data = {}) => {
  switch (type) {
    case 'WebSite':
      return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteConfig.url}/cheatsheet?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };

    case 'SoftwareApplication':
      return {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: data.name || 'SQL Beast Formatter',
        operatingSystem: 'Windows, macOS, Linux, Android, iOS',
        applicationCategory: 'DeveloperApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description: data.description || 'Premium developer suite to format, minify, and inspect SQL queries locally.',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '1240',
        },
      };

    case 'BlogPosting':
      return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: data.title,
        description: data.description,
        image: data.image || siteConfig.ogImage,
        datePublished: data.publishedAt,
        author: {
          '@type': 'Person',
          name: data.author || 'SQL Beast Team',
        },
        publisher: {
          '@type': 'Organization',
          name: siteConfig.name,
          logo: {
            '@type': 'ImageObject',
            url: `${siteConfig.url}/logo.png`,
          },
        },
      };

    default:
      return null;
  }
};
