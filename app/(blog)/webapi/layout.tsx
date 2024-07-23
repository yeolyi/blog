import { ReactNode } from 'react';

import PostLayout from '@/components/layout/PostLayout';

export default function WebAPIPostLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PostLayout discussionNumber={10}>{children}</PostLayout>;
}
