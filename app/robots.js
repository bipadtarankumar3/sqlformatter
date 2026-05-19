export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://sqlbeast.dev/sitemap.xml',
  };
}
