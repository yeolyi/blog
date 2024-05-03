import { useRef, useEffect } from 'react';

export default function Toc({
  headingList,
  currentHeading,
  setCurrentHeading,
  close,
}: {
  headingList: HTMLHeadingElement[];
  currentHeading: HTMLHeadElement | null;
  setCurrentHeading: (heading: HTMLHeadingElement) => void;
  close: () => void;
}) {
  return (
    <div className="flex flex-col items-start gap-2 p-8">
      {headingList.map((heading) => {
        const handleClick = () => {
          close();
          setCurrentHeading(heading);
          heading.scrollIntoView({ behavior: 'instant', block: 'start' });
        };

        return (
          <TocRow
            key={heading.id}
            heading={heading}
            highlight={currentHeading === heading}
            onClick={handleClick}
          />
        );
      })}
    </div>
  );
}

const TocRow = ({
  heading,
  onClick,
  highlight,
}: {
  heading: HTMLHeadingElement;
  onClick: () => void;
  highlight: boolean;
}) => {
  const isH2 = heading.tagName === 'H2';
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (highlight)
      ref.current?.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, [highlight]);

  return (
    <button
      ref={ref}
      key={heading.id}
      className={`max-w-[70vw] truncate text-left text-sm  hover:underline 
      ${isH2 ? 'font-bold' : 'ml-2 font-normal text-neutral-500'} 
      ${highlight && 'underline'}
      `}
      onClick={onClick}
    >
      {heading.textContent}
    </button>
  );
};
