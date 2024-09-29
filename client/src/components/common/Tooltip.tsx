import { useRef, useState } from 'react';
import { useClickOutsideHandler } from '../../utils/useClickOutsideHandler';
import * as styles from './Tooltip.css';

export type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'left' | 'right' | 'bottom' | 'bottomLeft' | 'bottomRight';
  onOpen?: (isOpen: boolean) => void;
};

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side,
  onOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
    onOpen?.(isOpen);
  };

  useClickOutsideHandler({
    ref: contentRef,
    excludeRef: wrapperRef,
    onClick: () => handleOpen(false),
  });

  return (
    <div className={styles.relative}>
      <div ref={wrapperRef} onClick={() => handleOpen(!isOpen)}>
        {children}
      </div>

      {isOpen && (
        <div ref={contentRef} className={styles.tooltip({ side })}>
          {content}
        </div>
      )}
    </div>
  );
};
