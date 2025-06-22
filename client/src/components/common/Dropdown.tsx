import React, { RefObject, useRef } from 'react';

import { useClickOutsideHandler } from '../../utils/useClickOutsideHandler';
import {
  DropdownAlignment,
  DropdownPosition,
  useDropdownPosition,
} from '../../utils/useDropdownPosition';
import { useLayoutContext } from '../LayoutContext';
import * as styles from './Dropdown.css';

export type DropdownProps = {
  children: React.ReactNode;
  content: React.ReactNode;
  isOpen: boolean;
  onOpen?: (isOpen: boolean) => void;
  onCloseOutside?: () => void;
  closeOutsideRef?: RefObject<HTMLDivElement | null>;
  position?: DropdownPosition;
  alignment?: DropdownAlignment;
  outline?: 'normal' | 'bold';
};

export const Dropdown = ({
  children,
  content,
  isOpen,
  onOpen,
  onCloseOutside,
  closeOutsideRef,
  position,
  alignment,
  outline,
}: DropdownProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useClickOutsideHandler({
    ref: contentRef,
    excludeRef: closeOutsideRef ?? anchorRef,
    onClick: () => {
      onOpen?.(false);
      onCloseOutside?.();
    },
  });

  return (
    <div ref={anchorRef} className={styles.wrapper}>
      <div onClick={() => onOpen?.(!isOpen)}>{children}</div>

      {isOpen && (
        <div ref={contentRef}>
          <DropdownContent
            content={content}
            anchorRef={anchorRef as React.RefObject<HTMLElement>}
            position={position}
            alignment={alignment}
            outline={outline}
          />
        </div>
      )}
    </div>
  );
};

type DropdownContentProps = {
  content: React.ReactNode;
  anchorRef: React.RefObject<HTMLElement>;
  position?: DropdownPosition;
  alignment?: DropdownAlignment;
  outline?: 'normal' | 'bold';
};

const DropdownContent = ({
  content,
  anchorRef,
  position,
  alignment,
  outline,
}: DropdownContentProps) => {
  const { containerRef } = useLayoutContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    position: computedPosition,
    alignment: computedAlignment,
    maxHeight,
  } = useDropdownPosition({
    dropdownRef,
    anchorRef,
    containerRef: containerRef ?? undefined,
    position,
    alignment,
  });

  return (
    <div
      ref={dropdownRef}
      className={styles.dropdown({
        position: computedPosition,
        alignment: computedAlignment,
        outline,
      })}
      style={{
        ...(maxHeight && { maxHeight }),
      }}
    >
      {content}
    </div>
  );
};
