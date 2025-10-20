/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://globedk.co.zw', // your actual domain
  generateRobotsTxt: true,           // Generate robots.txt file
  sitemapSize: 7000,
  changefreq: 'daily',
  priority: 0.7,
  outDir: './public',                // 🔥 Add this line
};
