export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	// Allows to automatically instanciate createClient with right options
	// instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
	__InternalSupabase: {
		PostgrestVersion: '12.2.3 (519615d)';
	};
	public: {
		Tables: {
			comments: {
				Row: {
					author_id: string | null;
					content: string;
					created_at: string;
					id: string;
					post_id: string;
					updated_at: string;
				};
				Insert: {
					author_id?: string | null;
					content: string;
					created_at?: string;
					id?: string;
					post_id: string;
					updated_at?: string;
				};
				Update: {
					author_id?: string | null;
					content?: string;
					created_at?: string;
					id?: string;
					post_id?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'comments_author_id_fkey';
						columns: ['author_id'];
						isOneToOne: false;
						referencedRelation: 'profiles';
						referencedColumns: ['id'];
					},
				];
			};
			emoji_reactions: {
				Row: {
					created_at: string;
					emoji: string;
					id: string;
					post_id: string;
					user_id: string | null;
				};
				Insert: {
					created_at?: string;
					emoji: string;
					id?: string;
					post_id: string;
					user_id?: string | null;
				};
				Update: {
					created_at?: string;
					emoji?: string;
					id?: string;
					post_id?: string;
					user_id?: string | null;
				};
				Relationships: [];
			};
			meme_tags: {
				Row: {
					id: string;
					meme_id: string | null;
					tag_id: string | null;
				};
				Insert: {
					id?: string;
					meme_id?: string | null;
					tag_id?: string | null;
				};
				Update: {
					id?: string;
					meme_id?: string | null;
					tag_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: 'meme_tags_meme_id_fkey';
						columns: ['meme_id'];
						isOneToOne: false;
						referencedRelation: 'memes';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'meme_tags_tag_id_fkey';
						columns: ['tag_id'];
						isOneToOne: false;
						referencedRelation: 'tags';
						referencedColumns: ['id'];
					},
				];
			};
			memes: {
				Row: {
					created_at: string | null;
					height: number;
					hidden: boolean;
					id: string;
					media_url: string;
					title: string | null;
					updated_at: string | null;
					width: number;
				};
				Insert: {
					created_at?: string | null;
					height: number;
					hidden?: boolean;
					id?: string;
					media_url: string;
					title?: string | null;
					updated_at?: string | null;
					width: number;
				};
				Update: {
					created_at?: string | null;
					height?: number;
					hidden?: boolean;
					id?: string;
					media_url?: string;
					title?: string | null;
					updated_at?: string | null;
					width?: number;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					created_at: string | null;
					github_id: string;
					id: string;
					registration_number: number;
					role: string | null;
				};
				Insert: {
					created_at?: string | null;
					github_id: string;
					id: string;
					registration_number?: number;
					role?: string | null;
				};
				Update: {
					created_at?: string | null;
					github_id?: string;
					id?: string;
					registration_number?: number;
					role?: string | null;
				};
				Relationships: [];
			};
			subscribers: {
				Row: {
					created_at: string;
					email: string;
					id: string;
				};
				Insert: {
					created_at?: string;
					email: string;
					id?: string;
				};
				Update: {
					created_at?: string;
					email?: string;
					id?: string;
				};
				Relationships: [];
			};
			tags: {
				Row: {
					created_at: string | null;
					id: string;
					name: string;
				};
				Insert: {
					created_at?: string | null;
					id?: string;
					name: string;
				};
				Update: {
					created_at?: string | null;
					id?: string;
					name?: string;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			add_emoji_reaction: {
				Args: { p_post_id: string; p_emoji: string; p_user_id: string };
				Returns: boolean;
			};
			binary_quantize: {
				Args: { '': string } | { '': unknown };
				Returns: unknown;
			};
			get_comments_with_developer_number: {
				Args: { post_id_param: string };
				Returns: {
					id: string;
					created_at: string;
					content: string;
					github_id: string;
					developernumber: number;
					author_id: string;
				}[];
			};
			get_emoji_counts: {
				Args: { p_post_id: string; p_user_id: string };
				Returns: {
					emoji: string;
					count: number;
					user_reacted: boolean;
				}[];
			};
			get_random_memes: {
				Args: { p_count: number };
				Returns: {
					id: string;
					media_url: string;
					title: string;
					width: number;
					height: number;
					hidden: boolean;
				}[];
			};
			get_subscriber_count: {
				Args: Record<PropertyKey, never>;
				Returns: number;
			};
			get_thumbsup_user_ids: {
				Args: { p_post_id: string };
				Returns: string[];
			};
			halfvec_avg: {
				Args: { '': number[] };
				Returns: unknown;
			};
			halfvec_out: {
				Args: { '': unknown };
				Returns: unknown;
			};
			halfvec_send: {
				Args: { '': unknown };
				Returns: string;
			};
			halfvec_typmod_in: {
				Args: { '': unknown[] };
				Returns: number;
			};
			hnsw_bit_support: {
				Args: { '': unknown };
				Returns: unknown;
			};
			hnsw_halfvec_support: {
				Args: { '': unknown };
				Returns: unknown;
			};
			hnsw_sparsevec_support: {
				Args: { '': unknown };
				Returns: unknown;
			};
			hnswhandler: {
				Args: { '': unknown };
				Returns: unknown;
			};
			insert_subscriber: {
				Args: { _email: string };
				Returns: undefined;
			};
			is_admin: {
				Args: Record<PropertyKey, never>;
				Returns: boolean;
			};
			ivfflat_bit_support: {
				Args: { '': unknown };
				Returns: unknown;
			};
			ivfflat_halfvec_support: {
				Args: { '': unknown };
				Returns: unknown;
			};
			ivfflathandler: {
				Args: { '': unknown };
				Returns: unknown;
			};
			l2_norm: {
				Args: { '': unknown } | { '': unknown };
				Returns: number;
			};
			l2_normalize: {
				Args: { '': string } | { '': unknown } | { '': unknown };
				Returns: string;
			};
			match_similar_meme: {
				Args:
					| {
							query_embedding: string;
							match_threshold: number;
							match_count: number;
					  }
					| {
							query_embedding: string;
							match_threshold: number;
							match_count: number;
							query_id: string;
					  }
					| { query_id: string; match_threshold: number; match_count: number };
				Returns: {
					id: string;
					media_url: string;
					distance: number;
				}[];
			};
			sparsevec_out: {
				Args: { '': unknown };
				Returns: unknown;
			};
			sparsevec_send: {
				Args: { '': unknown };
				Returns: string;
			};
			sparsevec_typmod_in: {
				Args: { '': unknown[] };
				Returns: number;
			};
			toggle_emoji_reaction: {
				Args: { p_post_id: string; p_emoji: string };
				Returns: boolean;
			};
			vector_avg: {
				Args: { '': number[] };
				Returns: string;
			};
			vector_dims: {
				Args: { '': string } | { '': unknown };
				Returns: number;
			};
			vector_norm: {
				Args: { '': string };
				Returns: number;
			};
			vector_out: {
				Args: { '': string };
				Returns: unknown;
			};
			vector_send: {
				Args: { '': string };
				Returns: string;
			};
			vector_typmod_in: {
				Args: { '': unknown[] };
				Returns: number;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	'public'
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
				DefaultSchema['Views'])
		? (DefaultSchema['Tables'] &
				DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof DatabaseWithoutInternals },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never,
> = PublicCompositeTypeNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {},
	},
} as const;
