export default function sitemap() {
  const baseUrl = 'https://sqlbeast.dev';
  const lastModified = new Date();

  const paths = [
    '',
    '/formatter',
    '/minifier',
    '/validator',
    '/analyzer',
    '/cheatsheet',
    '/keywords',
    '/examples',
    '/blog',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ];

  return paths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified,
    changeFrequency: path === '/blog' ? 'weekly' : 'monthly',
    priority: path === '' ? 1.0 : path === '/formatter' ? 0.9 : 0.7,
  }));
}
