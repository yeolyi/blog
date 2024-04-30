import { useState, useEffect } from 'react';

export const useAppeared = (
  element: HTMLElement | null,
  rootMargin?: string,
) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (element === null) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIntersecting(true);
      },
      { rootMargin },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [element, rootMargin]);

  return isIntersecting;
};
