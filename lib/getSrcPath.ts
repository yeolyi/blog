import path from 'path';
import { cwd } from 'process';

export default function getSrcPath() {
  const srcPath = process.env.SRC_PATH;
  if (srcPath === undefined) {
    throw new Error('SRC_PATH 환경변수가 없습니다.');
  }
  return path.join(cwd(), srcPath);
}
