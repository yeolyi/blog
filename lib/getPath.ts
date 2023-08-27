import path from 'path';
import { cwd } from 'process';

export function getPostSrcPath() {
  const srcPath = process.env.SRC_PATH;
  if (srcPath === undefined) {
    throw new Error('SRC_PATH 환경변수가 없습니다.');
  }
  return path.join(cwd(), srcPath);
}

export function getArticleSrcPath() {
  return path.join(getPostSrcPath(), 'article');
}

export function getAboutMDPath() {
  return path.join(getPostSrcPath(), 'about.md');
}
