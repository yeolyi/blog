import { getMemeById } from '@/app/[locale]/memes/actions';
import MemeEditForm from '../components/MemeEditForm';

export default async function MemeModalPage({
  params,
}: {
  params: Promise<{ memeId: string }>;
}) {
  const { memeId } = await params;
  const meme = await getMemeById(memeId);

  return (
    <div className="flex flex-col gap-4 p-8">
      <MemeEditForm meme={meme} />
    </div>
  );
}
