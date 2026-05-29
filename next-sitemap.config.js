/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://sqlformatter.revoxera.com',
  generateRobotsTxt: false, // We manage robots.txt manually
  outDir: 'public',
  exclude: ['/privacy', '/terms'],
};
