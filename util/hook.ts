import { useState, useEffect } from 'react';

export const useAppeared = (
  element: HTMLElement | null,
  rootMargin?: string,
) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (element === null) return;

    const callback: IntersectionObserverCallback = ([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        observer.disconnect();
      }
    };

    const observer = new IntersectionObserver(callback, { rootMargin });
    observer.observe(element);

    return () => observer.disconnect();
  }, [element, rootMargin]);

  return isIntersecting;
};

export const useLoaded = (element: HTMLElement | null) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (element === null) return;

    const loadHandler = () => setLoaded(true);
    element.addEventListener('load', loadHandler);
    return () => element.removeEventListener('load', loadHandler);
  }, [element]);

  return loaded;
};
