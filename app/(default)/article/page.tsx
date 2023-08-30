import PageHeader from '@/components/PageHeader';
import extractFrontMatter from '@/lib/extractFrontMatter';
import { getArticleSrcPath } from '@/lib/getPath';
import { isDirectory } from '@/lib/iteratePath';
import { readFile, readdir } from 'fs/promises';
import Link from 'next/link';
import path from 'path';

export default async function Article() {
  const frontmatters = await getFrontmatters();
  frontmatters.sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <PageHeader bottomMargin>Article</PageHeader>
      <div className="not-prose flex flex-col items-start gap-4">
        {frontmatters.map((prop) => (
          <div key={prop.segment}>
            <ArticleRow {...prop} />
            <hr className="mx-0 mt-2 mb-4" />
          </div>
        ))}
      </div>
    </>
  );
}

const ArticleRow = ({ title, segment, date }: ArticlePreview) => {
  return (
    <Link
      className="no-underline flex flex-col gap-0"
      href={`/article/${segment}`}
    >
      <h3 className="text-2xl text-white font-semibold">{title}</h3>
      <time className="text-base text-gray-300">{date}</time>
    </Link>
  );
};

interface ArticlePreview {
  title?: string;
  description?: string;
  date: string;
  segment: string;
}

const getFrontmatters = async () => {
  const articlePath = getArticleSrcPath();
  const folderAndFileNames = await readdir(articlePath);
  const frontmatters: ArticlePreview[] = [];

  const promises = folderAndFileNames.map(async (name) => {
    const namePath = path.join(articlePath, name);
    if (!(await isDirectory(namePath))) return;

    // TODO: index.md 없는거 예외 처리하기
    const mdPath = path.join(namePath, 'index.md');
    const md = await readFile(mdPath, { encoding: 'utf-8' });
    const frontmatter = extractFrontMatter(md);
    frontmatters.push({ ...frontmatter.data, segment: name, date: frontmatter.data.date ?? '-' });
  });

  await Promise.all(promises);

  return frontmatters;
};
