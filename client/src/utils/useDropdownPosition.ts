import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

export type DropdownPosition = 'top' | 'bottom';
export type DropdownAlignment = 'start' | 'center' | 'end';

export type UseDropdownPositionProps = {
  dropdownRef?: React.RefObject<HTMLElement | null>;
  anchorRef?: React.RefObject<HTMLElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
  minOffset?: number;
};

export function useDropdownPosition({
  dropdownRef,
  anchorRef,
  containerRef,
  minOffset = 50,
}: UseDropdownPositionProps): {
  position: DropdownPosition;
  alignment: DropdownAlignment;
} {
  const [position, setPosition] = useState<DropdownPosition>('bottom');
  const [alignment, setAlignment] = useState<DropdownAlignment>('center');

  const onResize = useCallback(() => {
    if (
      !dropdownRef?.current ||
      !anchorRef?.current ||
      !containerRef?.current
    ) {
      return;
    }

    const dropdownBoundRect = dropdownRef.current.getBoundingClientRect();
    const anchorBoundRect = anchorRef.current.getBoundingClientRect();
    const containerBoundRect = containerRef.current.getBoundingClientRect();

    const anchorCenterX = anchorBoundRect.left + anchorBoundRect.width / 2;
    const dropdownHalfWidth = dropdownBoundRect.width / 2;
    const leftOffset =
      anchorCenterX - dropdownHalfWidth - containerBoundRect.left;
    const rightOffset =
      containerBoundRect.right - anchorCenterX - dropdownHalfWidth;

    const bottomOffset =
      containerBoundRect.bottom -
      anchorBoundRect.bottom -
      dropdownBoundRect.height;
    const position = bottomOffset < minOffset ? 'top' : 'bottom';

    let alignment: DropdownAlignment = 'center';
    if (leftOffset < minOffset) {
      alignment = 'start';
    } else if (rightOffset < minOffset) {
      alignment = 'end';
    }

    setPosition(position);
    setAlignment(alignment);
  }, [anchorRef, containerRef, dropdownRef, minOffset]);

  useLayoutEffect(() => {
    window.addEventListener('resize', onResize);

    onResize();

    return () => window.removeEventListener('resize', onResize);
  }, [onResize, anchorRef]);

  return useMemo(() => ({ position, alignment }), [position, alignment]);
}
