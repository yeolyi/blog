import MemeList from '@/app/memes/components/MemeList';
import { getAllTags, getMemes } from '../actions';

export default async function MemeListServer() {
  const [memesResult, tags] = await Promise.all([getMemes(), getAllTags()]);

  return <MemeList memes={memesResult.data || []} allTags={tags} />;
}
