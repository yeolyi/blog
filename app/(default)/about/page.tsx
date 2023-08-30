import getFilledMD from '@/lib/getFilledMD';
import { getAboutMDPath } from '@/lib/getPath';
import { MDXRemote } from 'next-mdx-remote/rsc';

export default async function Home() {
  const aboutMDPath = getAboutMDPath();
  const source = await getFilledMD(aboutMDPath);

  return (
    <>
      <h1 className="text-6xl">About</h1>
      <MDXRemote source={source.content} />
    </>
  );
}
