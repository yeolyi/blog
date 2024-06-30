import PostLayout from '@/components/layout/PostLayout';
import { ReactNode } from 'react';

export default function WebAPIPostLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <PostLayout>{children}</PostLayout>;
}
