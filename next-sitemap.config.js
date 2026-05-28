/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://sqlbeast.dev',
  generateRobotsTxt: false, // We manage robots.txt manually
  outDir: 'public',
  exclude: ['/privacy', '/terms'],
};
