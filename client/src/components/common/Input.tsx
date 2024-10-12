import React from 'react';
import { Color } from '../../index.css';
import * as styles from './Input.css';

export type InputProps = {
  value: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  type?: 'text' | 'password';
  text?: 'original' | 'translation';
  placeholder?: string;
  textColor?: Color;
  size?: 'medium' | 'large';
  disabled?: boolean;
  left?: React.ReactNode;
  right?: React.ReactNode;
  loading?: boolean;
  obscured?: boolean;
};

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  onBlur,
  type,
  text,
  placeholder,
  textColor,
  size,
  disabled,
  left,
  right,
  loading,
  obscured,
}) => {
  return (
    <div className={styles.wrapper}>
      {left && <div className={styles.left}>{left}</div>}
      <input
        className={styles.input({
          text,
          textColor,
          size,
          disabled,
          loading,
          obscured,
          left: Boolean(left),
          right: Boolean(right),
        })}
        type={type ?? 'text'}
        value={obscured ? '' : value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
      />
      {right && <div className={styles.right}>{right}</div>}
    </div>
  );
};
