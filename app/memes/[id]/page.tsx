import { getMeme } from '@/app/memes/actions';
import MemeDetail from './components/MemeDetail';
import { getIsAdmin } from '@/utils/auth';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

export default async function MemePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const [meme, isAdmin] = await Promise.all([getMeme(id), getIsAdmin()]);

    if (!meme) {
      return notFound();
    }

    return (
      <Suspense fallback={<p>로딩 중...</p>}>
        <MemeDetail meme={meme} isAdmin={isAdmin} />
      </Suspense>
    );
  } catch (error) {
    console.error('밈 상세 페이지 로드 오류:', error);
    return notFound();
  }
}
