import React, { useEffect } from 'react';

export type UseClickOutsideHandlerProps<H extends HTMLElement> = {
  ref: React.RefObject<H>;
  onClick: () => void;
};

export function useClickOutsideHandler<H extends HTMLElement>({
  ref,
  onClick,
}: UseClickOutsideHandlerProps<H>) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as H)) {
        onClick();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, onClick]);
}
