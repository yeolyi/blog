import { readFile } from 'fs/promises';
import path from 'path';
import { getPostSrcPath } from './getPath';
import replaceCodeDirectives from './replaceCodeDirectives';
import extractFrontMatter from './extractFrontMatter';
import extractTOC from './extractTOC';
import { PostCache, cache } from './postCache';

export default async function getFilledMD(postPath: string): Promise<PostCache> {
  if (isProduction && postPath in cache) {
    return cache[postPath];
  }

  const md = await readFile(postPath, { encoding: 'utf-8' });
  const { data, content } = extractFrontMatter(md);
  const toc = extractTOC(content);
  const replacedMD = await replaceCodeDirectives(content, postPath);

  return (cache[postPath] = { data, content: replacedMD, toc });
}

const isProduction = process.env.NODE_ENV === 'production';
