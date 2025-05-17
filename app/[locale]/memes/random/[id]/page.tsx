import MemeSwipe from '@/app/[locale]/memes/MemeSwipe';
import { getAllTags, getMemeById } from '@/app/[locale]/memes/actions';

export default async function MemesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const [randomMeme, tags] = await Promise.all([getMemeById(id), getAllTags()]);

  return <MemeSwipe initialMeme={randomMeme} allTags={tags} />;
}
