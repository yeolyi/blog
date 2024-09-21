import { postPageList } from '@/client/mdx/post';
import RSS from 'rss';

let BASE_URL = 'https://yeolyi.com';

let feed = new RSS({
  title: '개발자 성열',
  description: '배우고 익히는 재미로 사는 프론트엔드 개발자 이성열입니다.',
  feed_url: `${BASE_URL}/rss.xml`,
  site_url: BASE_URL,
  image_url: `${BASE_URL}/me.jpg`,
});

for (let page of postPageList) {
  feed.item({
    title: page.title,
    description: page.description,
    url: `${BASE_URL}${page.path}`,
    date: new Date(page.dateStr ?? Date.now()).toISOString(),
  });
}

export let xml = feed.xml();
