import MemeSwipe from '@/app/[locale]/memes/MemeSwipe';
import { getAllTags, getRandomMeme } from '../actions';

export default async function MemesPage() {
  const [randomMeme, tags] = await Promise.all([getRandomMeme(), getAllTags()]);

  return <MemeSwipe initialMeme={randomMeme} allTags={tags} />;
}
