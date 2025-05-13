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
  title?: string;
  media_url: string;
  width: number;
  height: number;
  created_at: string;
  updated_at: string;
  meme_tags: MemeTag[];
  hidden: boolean;
}
