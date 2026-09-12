import React, { useEffect, useRef } from 'react';

export type UseInfiniteScrollProps = {
  isFetching: boolean;
  fetchNextPage: () => void;
};

export function useInfiniteScroll<H extends HTMLElement>({
  isFetching,
  fetchNextPage,
}: UseInfiniteScrollProps): React.RefObject<H | null> {
  const listEndRef = useRef<H>(null);

  useEffect(() => {
    if (isFetching) {
      return;
    }

    const observer = new IntersectionObserver(([target]) => {
      if (target.isIntersecting) {
        fetchNextPage();
      }
    });

    const listEndRefCurrent = listEndRef.current;
    if (listEndRefCurrent) {
      observer.observe(listEndRefCurrent);
    }

    return () => {
      if (listEndRefCurrent) {
        observer.unobserve(listEndRefCurrent);
      }
    };
  }, [isFetching, fetchNextPage]);

  return listEndRef;
}
