import { useCallback, useLayoutEffect, useMemo, useState } from 'react';

export type DropdownPosition = 'top' | 'bottom';
export type DropdownAlignment = 'start' | 'center' | 'end' | 'stretch';

export type UseDropdownPositionProps = {
  dropdownRef?: React.RefObject<HTMLElement | null>;
  anchorRef?: React.RefObject<HTMLElement | null>;
  containerRef?: React.RefObject<HTMLElement | null>;
  position?: DropdownPosition;
  alignment?: DropdownAlignment;
  minOffset?: number;
  verticalGap?: number;
};

export function useDropdownPosition({
  dropdownRef,
  anchorRef,
  containerRef,
  position: fixedPosition,
  alignment: fixedAlignment,
  minOffset = 30,
  verticalGap = 5,
}: UseDropdownPositionProps): {
  position: DropdownPosition;
  alignment: DropdownAlignment;
  maxHeight: number;
} {
  const [position, setPosition] = useState<DropdownPosition>(
    fixedPosition ?? 'bottom',
  );
  const [alignment, setAlignment] = useState<DropdownAlignment>(
    fixedAlignment ?? 'center',
  );
  const [maxHeight, setMaxHeight] = useState<number>(0);

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

    const position =
      fixedPosition ?? computePosition({ anchorBoundRect, containerBoundRect });
    const maxHeight = computeMaxHeight({
      anchorBoundRect,
      containerBoundRect,
      position,
      minOffset,
      verticalGap,
    });

    const alignment =
      fixedAlignment ??
      computeAlignment({
        dropdownBoundRect,
        anchorBoundRect,
        containerBoundRect,
        minOffset,
      });

    setPosition(position);
    setAlignment(alignment);
    setMaxHeight(maxHeight);
  }, [
    anchorRef,
    containerRef,
    dropdownRef,
    fixedPosition,
    fixedAlignment,
    minOffset,
    verticalGap,
  ]);

  useLayoutEffect(() => {
    window.addEventListener('resize', onResize);

    onResize();

    return () => window.removeEventListener('resize', onResize);
  }, [onResize, anchorRef]);

  return useMemo(
    () => ({ position, alignment, maxHeight }),
    [position, alignment, maxHeight],
  );
}

function computePosition({
  anchorBoundRect,
  containerBoundRect,
}: {
  anchorBoundRect: DOMRect;
  containerBoundRect: DOMRect;
}): DropdownPosition {
  const bottomOffset = containerBoundRect.bottom - anchorBoundRect.bottom;
  const topOffset = anchorBoundRect.top - containerBoundRect.top;

  return bottomOffset < topOffset ? 'top' : 'bottom';
}

function computeMaxHeight({
  anchorBoundRect,
  containerBoundRect,
  position,
  minOffset,
  verticalGap,
}: {
  anchorBoundRect: DOMRect;
  containerBoundRect: DOMRect;
  position: DropdownPosition;
  minOffset: number;
  verticalGap: number;
}): number {
  if (position === 'top') {
    return (
      anchorBoundRect.top - containerBoundRect.top - minOffset - verticalGap
    );
  } else {
    return (
      containerBoundRect.bottom -
      anchorBoundRect.bottom -
      minOffset -
      verticalGap
    );
  }
}

function computeAlignment({
  dropdownBoundRect,
  anchorBoundRect,
  containerBoundRect,
  minOffset,
}: {
  dropdownBoundRect: DOMRect;
  anchorBoundRect: DOMRect;
  containerBoundRect: DOMRect;
  minOffset: number;
}): DropdownAlignment {
  const anchorCenterX = anchorBoundRect.left + anchorBoundRect.width / 2;
  const dropdownHalfWidth = dropdownBoundRect.width / 2;
  const centeredLeftOffset =
    anchorCenterX - dropdownHalfWidth - containerBoundRect.left;
  const centeredRightOffset =
    containerBoundRect.right - anchorCenterX - dropdownHalfWidth;

  let alignment: DropdownAlignment = 'center';
  if (centeredLeftOffset < minOffset) {
    alignment = 'start';
  } else if (centeredRightOffset < minOffset) {
    alignment = 'end';
  }

  return alignment;
}
