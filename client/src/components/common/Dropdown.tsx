import React, { useRef } from 'react';

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
  onOpen: (isOpen: boolean) => void;
  position?: DropdownPosition;
  alignment?: DropdownAlignment;
};

export const Dropdown = ({
  children,
  content,
  isOpen,
  onOpen,
  position,
  alignment,
}: DropdownProps) => {
  const anchorRef = useRef<HTMLDivElement>(null);

  useClickOutsideHandler({ ref: anchorRef, onClick: () => onOpen(false) });

  return (
    <div ref={anchorRef} className={styles.wrapper}>
      <div onClick={() => onOpen(!isOpen)}>{children}</div>

      {isOpen && (
        <DropdownContent
          content={content}
          anchorRef={anchorRef as React.RefObject<HTMLElement>}
          position={position}
          alignment={alignment}
        />
      )}
    </div>
  );
};

type DropdownContentProps = {
  content: React.ReactNode;
  anchorRef: React.RefObject<HTMLElement>;
  position?: DropdownPosition;
  alignment?: DropdownAlignment;
};

const DropdownContent = ({
  content,
  anchorRef,
  position,
  alignment,
}: DropdownContentProps) => {
  const { containerRef } = useLayoutContext();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { position: computedPosition, alignment: computedAlignment } =
    useDropdownPosition({
      dropdownRef,
      anchorRef,
      containerRef: containerRef ?? undefined,
    });

  return (
    <div
      ref={dropdownRef}
      className={styles.dropdown({
        position: position ?? computedPosition,
        alignment: alignment ?? computedAlignment,
      })}
    >
      {content}
    </div>
  );
};
