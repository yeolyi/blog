import fs from 'node:fs';
import path from 'node:path';
import type { Locale } from 'next-intl';

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

export const getPostIds = async (locale: Locale) => {
  return await fetchPostIds(locale);
};
