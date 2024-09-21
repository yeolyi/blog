import { allMdxPosts } from '@/client/mdx';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

let BASE_URL = 'https://yeolyi.com';

export let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allMdxPosts.map((post) => {
  let lastmod = dayjs(post.dateStr ?? '1970.01.01', 'YYYY.MM.DD');
  let lastmodStr = lastmod.format('YYYY-MM-DD');

  return `<url>
    <loc>${BASE_URL}${post.path}</loc>
    <lastmod>${lastmodStr}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>`;
})}
</urlset> `;
