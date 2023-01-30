import React, { useRef, useCallback } from 'react';

export interface InfiniteScrollParams {
    onLoadMore: () => void;
}

export function useInfiniteScroll<E extends HTMLElement>({
    onLoadMore,
}: InfiniteScrollParams): (node: E) => void {
    const observer = useRef<IntersectionObserver>();
    return useCallback(
        (node: E) => {
            if (observer.current) {
                observer.current.disconnect();
            }

            observer.current = new IntersectionObserver(([entry]) => {
                if (entry.isIntersecting) {
                    onLoadMore();
                }
            });

            if (node) {
                observer.current.observe(node);
            }
        },
        [onLoadMore],
    );
}