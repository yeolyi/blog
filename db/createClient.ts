import type { Database } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient<Database>(
  // biome-ignore lint/style/noNonNullAssertion: 없으면 터져야지
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  // biome-ignore lint/style/noNonNullAssertion: 없으면 터져야지
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export default supabase;
