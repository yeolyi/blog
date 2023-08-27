import path from 'path';
import { getArticleSrcPath, getPostSrcPath } from './getPath';

export default function seg2Path(type: 'POST' | 'ARTICLE', segments?: string[]): string {
  if (type === 'ARTICLE') {
    return path.join(getArticleSrcPath(), ...(segments ?? []), 'index.md');
  } else {
    return path.join(getPostSrcPath(), ...(segments ?? []), 'index.md');
  }
}
