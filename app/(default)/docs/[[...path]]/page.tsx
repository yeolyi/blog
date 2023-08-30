import { Metadata } from 'next';
import { getPostSrcPath } from '@/lib/getPath';
import iteratePath from '@/lib/iteratePath';
import CustomMDXRemote from '../../../../components/CustomMDXRemote';
import getFilledMD from '@/lib/getFilledMD';
import TOC from '@/components/TOC';
import { GitHub } from 'react-feather';
import seg2Path from '@/lib/seg2Path';
import PageHeader from '@/components/PageHeader';

interface PostProps {
  params: {
    path?: string[];
  };
}

export const generateMetadata = async ({ params }: PostProps): Promise<Metadata> => {
  const { data } = await getFilledMD(seg2Path('POST', params.path));

  return {
    title: data.title,
    description: data.description,
  };
};

export default async function PostPage({ params }: PostProps) {
  const { data, content, toc } = await getFilledMD(seg2Path('POST', params.path));

  return (
    <>
      <div className="flex flex-col text-white">
        <PageHeader smallTitle={params.path !== undefined}>{data?.title}</PageHeader>
        {toc.h2.length !== 0 && <TOC toc={toc} />}
        <a
          className="self-end"
          href={getGithubLink(params.path)}
        >
          <GitHub size={24} />
        </a>
        <hr className="mt-4 mb-12" />
      </div>
      <CustomMDXRemote
        segments={params.path ?? []}
        source={content}
      />
    </>
  );
}

export const generateStaticParams = async () => {
  const params: { path: string[] }[] = [];
  const srcPath = getPostSrcPath();
  const skipFolder = (path: string) => path === 'node_modules' || path.startsWith('.');
  const f = (filePath: string, segments: string[]) => {
    if (filePath.endsWith('/index.md')) {
      params.push({ path: segments });
    }
  };
  await iteratePath(srcPath, [], f, skipFolder);

  return params;
};

const getGithubLink = (path: string[] | undefined) => {
  if (path === undefined || path.length === 0) {
    return `https://github.com/Yeolyi/blog_src/blob/main/index.md`;
  }
  return `https://github.com/Yeolyi/blog_src/blob/main/${path.join('/')}/index.md`;
};
