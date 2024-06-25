import { ReactNode } from 'react';
import Navigation from '../nav/Navigation';
import Giscus from '../Giscus';

export default function PostLayout({
  discussionNumber,
  children,
}: {
  discussionNumber?: number;
  children: ReactNode;
}) {
  return (
    <>
      <Navigation />
      {children}
      <div className="my-16 h-[1px] w-full bg-neutral-300" />
      <Giscus discussionNumber={discussionNumber} />
    </>
  );
}
