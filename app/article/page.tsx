import extractFrontMatter from '@/lib/extractFrontMatter';
import { getArticleSrcPath } from '@/lib/getPath';
import { isDirectory } from '@/lib/iteratePath';
import { readFile, readdir } from 'fs/promises';
import Link from 'next/link';
import path from 'path';

export default async function Article() {
  const frontmatters = await getFrontmatters();

  return (
    <>
      <h1>Article</h1>
      <div className="flex flex-col gap-4">
        {frontmatters.map((prop) => (
          <ArticleRow
            key={prop.segment}
            {...prop}
          />
        ))}
      </div>
    </>
  );
}

const ArticleRow = ({ title, segment, date }: ArticlePreview) => {
  return (
    <Link
      className="no-underline"
      href={`/article/${segment}`}
    >
      <h3 className="m-0">{title}</h3>
      <time>{date}</time>
    </Link>
  );
};

interface ArticlePreview {
  title?: string;
  description?: string;
  date?: string;
  segment: string;
}

const getFrontmatters = async () => {
  const articlePath = getArticleSrcPath();
  const folderAndFileNames = await readdir(articlePath);
  const frontmatters: ArticlePreview[] = [];

  const promises = folderAndFileNames.map(async (name) => {
    const namePath = path.join(articlePath, name);
    if (!(await isDirectory(namePath))) return;

    // TODO: index.md 없는거 처리하기
    const mdPath = path.join(namePath, 'index.md');
    const md = await readFile(mdPath, { encoding: 'utf-8' });
    const frontmatter = extractFrontMatter(md);
    frontmatters.push({ ...frontmatter.data, segment: name });
  });

  await Promise.all(promises);

  return frontmatters;
};
