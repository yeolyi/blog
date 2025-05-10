import MemeList from '@/app/[locale]/memes/components/MemeList';
import { getIsAdmin } from '@/utils/auth';
import { getAllTags, getMemes } from '../actions';

export default async function MemeListServer() {
  const [memesResult, tags, isAdmin] = await Promise.all([
    getMemes(),
    getAllTags(),
    getIsAdmin(),
  ]);

  return (
    <MemeList memes={memesResult.data || []} allTags={tags} isAdmin={isAdmin} />
  );
}
