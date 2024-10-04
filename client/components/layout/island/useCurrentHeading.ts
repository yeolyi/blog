import { throttle } from 'es-toolkit';
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
  }, []);

  useEffect(() => {
    // debounce쓰지말자 ^^...
    const handleScroll = throttle(() => {
      const heading = getCurHeading(headingList);
      setCurrentHeading(heading);
    }, 250);

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [headingList]);

  return { currentHeading, headingList };
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
