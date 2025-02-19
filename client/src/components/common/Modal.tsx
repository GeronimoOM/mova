import React, { useRef } from 'react';

import { useClickOutsideHandler } from '../../utils/useClickOutsideHandler';
import * as styles from './Modal.css';

export type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export const Modal = ({ children, onClose }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutsideHandler({ ref: modalRef, onClick: onClose });

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal} ref={modalRef}>
        {children}
      </div>
    </div>
  );
};
