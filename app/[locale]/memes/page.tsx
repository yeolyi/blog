import Admin from '@/app/[locale]/memes/components/Admin';
import MemeList from '@/app/[locale]/memes/components/MemeList';
import { getIsAdmin } from '@/utils/auth';
import { Suspense } from 'react';
import { getAllTags, getMemes } from './actions';

export default async function MemesPage() {
  const [memesResult, tags, isAdmin] = await Promise.all([
    getMemes(),
    getAllTags(),
    getIsAdmin(),
  ]);

  return (
    <div className="mx-auto my-24 mb-[30vh] p-8 flex flex-col gap-4 w-full">
      <Suspense>
        <Admin isAdmin={isAdmin} />
      </Suspense>
      <Suspense
        fallback={
          <div className="text-xl font-medium text-[#5e5e5e]">로딩 중...</div>
        }
      >
        <MemeList memes={memesResult} allTags={tags} />
      </Suspense>
    </div>
  );
}
