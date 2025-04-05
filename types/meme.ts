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
