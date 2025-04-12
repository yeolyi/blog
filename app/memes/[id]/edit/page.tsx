import { getMeme } from '@/app/memes/actions';
import { getIsAdmin } from '@/utils/auth';
import { notFound, redirect } from 'next/navigation';
import MemeEditForm from './components/MemeEditForm';

export default async function MemeEditPage({
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

    // 관리자가 아닌 경우 접근 제한
    if (!isAdmin) {
      redirect('/memes');
    }

    return (
      <div style={{ padding: '2rem' }}>
        <h1>밈 수정</h1>
        <MemeEditForm meme={meme} />
      </div>
    );
  } catch (error) {
    console.error('밈 수정 페이지 로드 오류:', error);
    return notFound();
  }
}
