'use client';

import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

// TODO: refactor
export default function Navigation() {
  const [headingList, setHeadingList] = useState<HTMLHeadingElement[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [curHeading, setCurHeading] = useState<HTMLHeadingElement | null>(null);
  const containrRef = useRef<HTMLDivElement>();

  useClickOutside(containrRef, () => setExpanded(false));

  useEffect(() => {
    const headingList = [
      ...document.querySelectorAll('h2,h3'),
    ] as HTMLHeadingElement[];

    setHeadingList(headingList);
    setCurHeading(getCurHeading(headingList));

    let timeoutId: number | null = null;
    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = window.setTimeout(() => {
        setCurHeading(getCurHeading(headingList));
        timeoutId = null;
      }, 250);
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
      timeoutId && clearTimeout(timeoutId);
    };
  }, []);

  return (
    <nav
      className={`not-prose fixed left-1/2 top-4 z-50 max-h-[50%] max-w-[80%] -translate-x-1/2 overflow-y-scroll overscroll-contain bg-white shadow-xl shadow-slate-700/10 ${expanded ? 'rounded-xl' : 'rounded-full'} no-scrollbar ring-1 ring-gray-900/5`}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {!expanded && <Cur heading={curHeading} />}
      {expanded && (
        <Toc
          headingList={headingList}
          cur={curHeading}
          close={() => {
            setExpanded(false);
          }}
          setCur={setCurHeading}
        />
      )}
    </nav>
  );
}

const Cur = ({ heading }: { heading: HTMLHeadingElement | null }) => {
  return (
    <div
      className={`self-center truncate whitespace-nowrap px-5 py-2 text-center text-base font-bold`}
    >
      {heading?.textContent ?? '-'}
    </div>
  );
};

const Toc = ({
  headingList,
  cur,
  close,
  setCur,
}: {
  headingList: HTMLHeadingElement[];
  cur: HTMLHeadElement | null;
  close: () => void;
  setCur: (heading: HTMLHeadingElement) => void;
}) => {
  return (
    <div className="flex flex-col items-start gap-2 p-8">
      {headingList.map((heading) => (
        <TocRow
          heading={heading}
          key={heading.id}
          cur={cur === heading}
          close={close}
          setCur={setCur}
        />
      ))}
    </div>
  );
};

const TocRow = ({
  heading,
  cur,
  close,
  setCur,
}: {
  heading: HTMLHeadingElement;
  cur: boolean;
  close: () => void;
  setCur: (heading: HTMLHeadingElement) => void;
}) => {
  const isH2 = heading.tagName === 'H2';
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (cur)
      ref.current?.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, [cur]);

  return (
    <button
      ref={ref}
      key={heading.id}
      className={`max-w-[90%] truncate text-left text-sm  hover:underline ${isH2 ? 'font-bold' : 'ml-2 font-normal text-neutral-500'} ${cur && 'underline'}`}
      onClick={() => {
        close();
        heading.scrollIntoView({ behavior: 'instant', block: 'start' });
        setCur(heading);
      }}
    >
      {heading.textContent}
    </button>
  );
};

const getCurHeading = (headingList: HTMLHeadingElement[]) => {
  const boundaryOffset = window.scrollY + window.innerHeight / 2;
  const offsetList = headingList
    .map(
      (heading) =>
        [
          boundaryOffset -
            (heading.getBoundingClientRect().top + window.scrollY) +
            100,
          heading,
        ] as const,
    )
    .filter(([offset]) => 0 <= offset)
    .sort((a, b) => a[0] - b[0]);

  if (offsetList.length) return offsetList[0][1];
  else return headingList[0];
};

const useClickOutside = (
  ref: MutableRefObject<HTMLElement | undefined>,
  callback: () => void,
) => {
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [callback, ref]);
};
