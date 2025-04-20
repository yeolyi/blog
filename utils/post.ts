import fs from 'node:fs';
import path from 'node:path';
import type { Locale } from 'next-intl';
import { unstable_cache } from 'next/cache';

// 실제 포스트 ID를 가져오는 함수
const fetchPostIds = async (locale: Locale) => {
  const postsDirectory = path.join(process.cwd(), 'mdx');
  const directories = fs.readdirSync(postsDirectory, { withFileTypes: true });

  return directories
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => {
      const dirPath = path.join(postsDirectory, dirent.name);
      const files = fs.readdirSync(dirPath);
      return files.includes(`${locale}.mdx`);
    })
    .map((dirent) => dirent.name);
};

export const getPostIds = unstable_cache(async (locale: Locale) => {
  return await fetchPostIds(locale);
});
