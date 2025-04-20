import { getMeme } from '@/app/[locale]/memes/actions';
import { getIsAdmin } from '@/utils/auth';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import MemeDetail from './components/MemeDetail';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;

  try {
    const meme = await getMeme(id);

    if (!meme) {
      return {} as Metadata;
    }

    return {
      title: `${meme.title || '무제 밈'} | 개발자 성열`,
      description: meme.description || '밈입니다.',
    };
  } catch (error) {
    console.error('메타데이터 생성 오류:', error);
    return {} as Metadata;
  }
}

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
