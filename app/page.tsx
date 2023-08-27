import getFilledMD from '@/lib/getFilledMD';
import { getAboutMDPath } from '@/lib/getPath';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { redirect } from 'next/navigation';

export default async function Home() {
  redirect('/about');
}
