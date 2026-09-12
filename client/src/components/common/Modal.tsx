import classNames from 'classnames';
import React, { useRef } from 'react';

import { useClickOutsideHandler } from '../../hooks/useClickOutsideHandler';
import * as styles from './Modal.css';

export type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
  modalClassName?: string;
};

export const Modal = ({ children, onClose, modalClassName }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useClickOutsideHandler({ ref: modalRef, onClick: onClose });

  return (
    <>
      <div className={styles.backdrop} />
      <div className={styles.modalWrapper}>
        <div
          className={classNames(styles.modal, modalClassName)}
          ref={modalRef}
        >
          {children}
        </div>
      </div>
    </>
  );
};
