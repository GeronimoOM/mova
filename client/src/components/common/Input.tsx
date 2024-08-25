import React from 'react';
import { Color } from '../../index.css';
import * as styles from './Input.css';

export type InputProps = {
  value: string;
  onChange: (value: string) => void;
  text?: 'original' | 'translation';
  textColor?: Color;
  size?: 'medium' | 'large';
  disabled?: boolean;
  padding?: boolean;
  loading?: boolean;
  obscured?: boolean;
};

export const Input: React.FC<InputProps> = ({
  value,
  onChange,
  text,
  textColor,
  size,
  disabled,
  padding,
  loading,
  obscured,
}) => {
  return (
    <input
      className={styles.input({
        text,
        textColor,
        size,
        disabled,
        padding,
        loading,
        obscured,
      })}
      type="text"
      spellCheck={false}
      autoCapitalize={'off'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
