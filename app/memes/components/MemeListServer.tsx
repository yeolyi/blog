import MemeList from "@/app/memes/components/MemeList";
import { getAllTags, getMemes } from "../actions";

export interface Tag {
  id: string;
  name: string;
}

export interface MemeTag {
  tag_id: string;
  tags: Tag;
}

export interface Meme {
  id: string;
  title: string;
  description: string | null;
  media_url: string;
  created_at: string;
  meme_tags: MemeTag[];
}

interface MemeListProps {
  isAdmin: boolean;
  selectedTag?: string;
}

export default async function MemeListServer({
  isAdmin,
  selectedTag,
}: MemeListProps) {
  const [memesResult, tags] = await Promise.all([
    getMemes(selectedTag),
    getAllTags(),
  ]);

  return (
    <MemeList
      memes={memesResult.data || []}
      allTags={tags}
      isAdmin={isAdmin}
      selectedTag={selectedTag}
    />
  );
}
