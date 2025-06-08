import fs from 'node:fs';
import path from 'node:path';
import type { Locale } from 'next-intl';

export const getMdxIds = async (locale: Locale, subDir?: string) => {
  const postsDirectory = path.join(process.cwd(), 'mdx', subDir ?? '');
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

// TODO: 없애기
export const getPostIds = async (locale: Locale, subDir?: string) => {
  return await getMdxIds(locale, subDir);
};
