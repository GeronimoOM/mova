import { useLayoutEffect, useState } from 'react';

export function useWidthListener(
  ref?: React.RefObject<HTMLElement | null>,
): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function onResize() {
      if (!ref?.current) {
        return;
      }

      setWidth(ref.current.getBoundingClientRect().width);
    }

    window.addEventListener('resize', onResize);

    onResize();

    return () => window.removeEventListener('resize', onResize);
  }, [ref]);

  return width;
}
