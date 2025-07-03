import type { Database } from '@/types/database.types';

export type Tag = Database['public']['Tables']['tags']['Row'];

export type Meme = Database['public']['Tables']['memes']['Row'];

export type Comment =
	Database['public']['Functions']['get_comments_with_developer_number']['Returns'][number];
