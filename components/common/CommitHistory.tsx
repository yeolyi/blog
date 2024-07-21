'use server';

import Link from 'next/link';
import { simpleGit } from 'simple-git';

const git = simpleGit({ baseDir: process.cwd() });

export default async function CommitHistory({ dir }: { dir: string }) {
  let log = await git.log({ file: dir });
  let firstHash = log.all.at(-1)?.hash;
  let latestHash = log.all[0]?.hash;

  if (firstHash === undefined || latestHash === undefined) return null;

  return (
    <p className="font-firacode text-sm">
      createdAt:
      <HashLink hash={firstHash} /> modifiedAt:
      <HashLink hash={latestHash} />
    </p>
  );
}

let HashLink = ({ hash }: { hash: string }) => (
  <Link
    href={`https://github.com/yeolyi/blog/commit/${hash}`}
    className="underline hover:font-bold"
  >
    {hash.slice(0, 7)}
  </Link>
);
