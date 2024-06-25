import PostLayout from '@/components/layout/PostLayout';
import { ReactNode } from 'react';

export default function JSPostLayout({ children }: { children: ReactNode }) {
  return <PostLayout discussionNumber={2}>{children}</PostLayout>;
}
