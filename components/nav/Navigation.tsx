'use client';

import { useClickOutside } from '@/util/hook';
import { useRef, useState } from 'react';
import useCurrentHeading from './useCurrentHeading';
import Toc from './Toc';

export default function Navigation() {
  const { currentHeading, setCurrentHeading, headingList } =
    useCurrentHeading();
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>();

  useClickOutside(containerRef, () => setExpanded(false));

  return (
    <nav
      className={`not-prose fixed left-1/2 top-4 z-50 max-h-[50%] -translate-x-1/2 overflow-y-scroll overscroll-contain bg-white shadow-xl shadow-slate-700/10 ${expanded ? 'rounded-xl' : 'rounded-full'} no-scrollbar ring-1 ring-gray-900/5`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {!expanded && <CurrentHeading heading={currentHeading} />}
      {expanded && (
        <Toc
          headingList={headingList}
          currentHeading={currentHeading}
          setCurrentHeading={setCurrentHeading}
          close={() => setExpanded(false)}
        />
      )}
    </nav>
  );
}

const CurrentHeading = ({
  heading,
}: {
  heading: HTMLHeadingElement | null;
}) => {
  return (
    <div
      className={`max-w-[80vw] self-center truncate whitespace-nowrap px-5 py-2 text-center text-base font-bold`}
    >
      {heading?.textContent ?? '-'}
    </div>
  );
};
