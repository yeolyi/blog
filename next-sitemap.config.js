/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL || 'https://www.yeolyi.com',
  changefreq: 'always',
  generateRobotsTxt: true,
};
