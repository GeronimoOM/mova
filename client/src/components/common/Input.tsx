import React, { useEffect, useState } from 'react';
import { Color } from '../../api/types/graphql';
import { AccentColor } from '../../index.css';
import * as styles from './Input.css';

export type InputProps = {
  value: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'password';
  text?: 'original' | 'translation';
  placeholder?: string;
  textColor?: AccentColor | Color;
  size?: 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  obscured?: boolean;
  ghost?: boolean;
  dynamicWidth?: boolean;
  maxLength?: number;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export const Input = ({
  value,
  onChange,
  type,
  text,
  placeholder,
  textColor,
  size,
  disabled,
  loading,
  obscured,
  ghost,
  dynamicWidth,
  maxLength,
  left,
  right,
}: InputProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    if (value !== localValue.trim()) {
      setLocalValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleChange = (newValue: string) => {
    if (maxLength && newValue.length === maxLength) {
      return;
    }

    setLocalValue(newValue);
    onChange?.(newValue.trim());
  };

  const inputSize = dynamicWidth
    ? Math.max((localValue.length || placeholder?.length) ?? 0, 1)
    : undefined;

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
          ghost,
          left: Boolean(left),
          right: Boolean(right),
        })}
        type={type ?? 'text'}
        value={obscured ? '' : localValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        size={inputSize}
      />
      {right && <div className={styles.right}>{right}</div>}
    </div>
  );
};
