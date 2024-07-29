import React from 'react';
import * as styles from './Input.css';

export type InputProps = {
  value: string;
  onChange: (value: string) => void;
  text?: 'original' | 'translation';
  size?: 'medium' | 'large';
  disabled?: boolean;
  padding?: boolean;
  loading?: boolean;
};

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  text,
  size,
  disabled,
  padding,
  loading,
}) => {
  return (
    <input
      className={styles.input({ text, size, disabled, padding, loading })}
      type="text"
      spellCheck={false}
      autoCapitalize={'off'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
