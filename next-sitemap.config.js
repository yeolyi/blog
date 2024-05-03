/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.yeolyi.com',
  changefreq: 'always',
  generateRobotsTxt: true,
};
