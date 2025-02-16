import React, { useRef } from "react";

import * as styles from './Modal.css';
import { useClickOutsideHandler } from "../../utils/useClickOutsideHandler";

export type ModalProps = {
    children: React.ReactNode;
    onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useClickOutsideHandler({ ref: modalRef, onClick: onClose });

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal} ref={modalRef}>
                {children}
            </div>
        </div>
    );
}