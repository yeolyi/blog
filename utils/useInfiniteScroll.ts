import { useCallback, useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onIntersect: () => Promise<void>;
  rootMargin?: string;
}

export function useInfiniteScroll({
  loading,
  hasMore,
  onIntersect,
  rootMargin = "100px",
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLElement | null>(null);

  // 마지막 아이템에 ref를 설정할 콜백
  const setLastItemRef = useCallback((node: HTMLElement | null) => {
    lastItemRef.current = node;
  }, []);

  // 인터섹션 옵저버 설정
  useEffect(() => {
    if (loading) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    const callback = async (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore) {
        await onIntersect();
      }
    };

    observerRef.current = new IntersectionObserver(callback, {
      rootMargin,
    });

    if (lastItemRef.current) {
      observerRef.current.observe(lastItemRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loading, hasMore, onIntersect, rootMargin]);

  return { setLastItemRef };
}
