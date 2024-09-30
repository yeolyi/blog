import { useRef, useState } from 'react';
import { RiHomeLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

import { useClickOutside } from '@/client/util/useClickOutside';

import useCurrentHeading from './useCurrentHeading';
import Toc from './Toc';

export default function Island() {
  const { currentHeading, setCurrentHeading, headingList } =
    useCurrentHeading();
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>();

  useClickOutside(containerRef, () => setExpanded(false));

  return (
    <nav
      className={`not-prose fixed left-1/2 top-6 z-50 flex h-fit max-h-[300px] -translate-x-1/2 gap-2`}
    >
      <div
        className={`overflow-y-scroll overscroll-contain bg-white shadow-xl shadow-slate-700/10 ${expanded ? 'rounded-xl' : 'rounded-full'} no-scrollbar ring-1 ring-gray-900/5 dark:border-2 dark:border-stone-600 dark:bg-black`}
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
      </div>
      {!expanded && (
        <Link
          to="/"
          className="flex w-[40px] items-center justify-center rounded-full bg-white shadow-xl shadow-slate-700/10 ring-1 ring-gray-900/5 dark:border-2 dark:border-stone-600 dark:bg-black"
        >
          <RiHomeLine className="h-5 w-5" />
        </Link>
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
      className={`w-fit max-w-[80vw] self-center truncate whitespace-nowrap px-5 py-2 text-center text-base font-semibold`}
    >
      {heading?.textContent ?? '-'}
    </div>
  );
};
