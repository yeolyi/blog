import { useEffect, useState } from 'react';

const useCurrentHeading = () => {
  const [headingList, setHeadingList] = useState<HTMLHeadingElement[]>([]);
  const [currentHeading, setCurrentHeading] = useState<HTMLHeadingElement>();

  useEffect(() => {
    const headingList = [
      ...document.querySelectorAll('h2,h3'),
    ] as HTMLHeadingElement[];

    setHeadingList(headingList);
    setCurrentHeading(getCurHeading(headingList));

    let timeoutId: number | null = null;
    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = window.setTimeout(() => {
        setCurrentHeading(getCurHeading(headingList));
        timeoutId = null;
      }, 250);
    };

    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, []);

  return {
    currentHeading: currentHeading ?? headingList[0],
    setCurrentHeading,
    headingList,
  };
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
    .filter(([offset]) => offset >= 0)
    .sort((a, b) => a[0] - b[0]);

  if (offsetList.length) return offsetList[0][1];
  else return headingList[0];
};

export default useCurrentHeading;
