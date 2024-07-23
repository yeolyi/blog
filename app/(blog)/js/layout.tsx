import { ReactNode } from 'react';

import PostLayout from '@/components/layout/PostLayout';

export default function JSPostLayout({ children }: { children: ReactNode }) {
  return <PostLayout discussionNumber={2}>{children}</PostLayout>;
}
