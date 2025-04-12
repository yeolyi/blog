import fs from 'node:fs';
import path from 'node:path';

export const getPostIds = async () => {
  const postsDirectory = path.join(process.cwd(), 'mdx');
  const directories = fs.readdirSync(postsDirectory, { withFileTypes: true });

  return directories
    .filter((dirent) => dirent.isDirectory())
    .filter((dirent) => {
      const dirPath = path.join(postsDirectory, dirent.name);
      const files = fs.readdirSync(dirPath);
      return files.includes('page.mdx');
    })
    .map((dirent) => dirent.name);
};
