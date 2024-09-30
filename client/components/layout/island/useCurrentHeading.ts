import { debounce } from 'es-toolkit';
import { useEffect, useState } from 'react';

const useCurrentHeading = () => {
  const [headingList, setHeadingList] = useState<HTMLHeadingElement[]>([]);
  const [currentHeading, setCurrentHeading] = useState<HTMLHeadingElement>();

  useEffect(() => {
    // TODO: 이게 맞나?
    if (0 < headingList.length) return;

    const handleMutation = () => {
      const headingList = [
        ...document.querySelectorAll('h2,h3'),
      ] as HTMLHeadingElement[];

      setHeadingList(headingList);
      setCurrentHeading(getCurHeading(headingList));
    };

    const observer = new MutationObserver(handleMutation);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleScroll = debounce(() => {
      setCurrentHeading(getCurHeading(headingList));
    }, 250);

    document.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('scroll', handleScroll);
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
