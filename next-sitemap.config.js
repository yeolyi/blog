/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || 'https://www.yeolyi.com',
  changefreq: 'always',
  generateRobotsTxt: true,
};

export default config;
