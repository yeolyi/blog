import { ReactNode } from 'react';

import Giscus from '../common/Giscus';
import Navigation from '../nav/Navigation';

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
