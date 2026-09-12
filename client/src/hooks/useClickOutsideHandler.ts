import React, { useEffect } from 'react';

export type UseClickOutsideHandlerProps<H extends HTMLElement> = {
  ref: React.RefObject<H | null>;
  excludeRef?: React.RefObject<HTMLElement | null>;
  onClick: () => void;
};

export function useClickOutsideHandler<H extends HTMLElement>({
  ref,
  excludeRef,
  onClick,
}: UseClickOutsideHandlerProps<H>) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as H) &&
        !excludeRef?.current?.contains(event.target as HTMLElement)
      ) {
        onClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClick]);
}
