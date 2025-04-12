import { Suspense } from 'react';
import MemeListServer from '@/app/memes/components/MemeListServer';
import Admin from '@/app/memes/components/Admin';

export default async function MemesPage() {
  return (
    <div className="mx-auto my-24 mb-[30vh] p-8 flex flex-col gap-4">
      <Suspense>
        <Admin />
      </Suspense>
      <Suspense
        fallback={
          <div className="text-xl font-medium text-[#5e5e5e]">로딩 중...</div>
        }
      >
        <MemeListServer />
      </Suspense>
    </div>
  );
}
