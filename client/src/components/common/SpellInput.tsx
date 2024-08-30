import classNames from 'classnames';
import { useCallback, useRef } from 'react';
import { Color } from '../../index.css';
import * as styles from './SpellInput.css';

const OBSCURED_LENGTH = 50;

type SpellInputProps = {
  value: string;
  onChange: (value: string) => void;
  length: number;
  obscureLength?: boolean;
  disabled?: boolean;
  highlights?: Array<Color | null>;
};

export const SpellInput: React.FC<SpellInputProps> = ({
  value,
  onChange,
  length,
  obscureLength,
  disabled,
  highlights,
}) => {
  length = obscureLength ? OBSCURED_LENGTH : length;

  const cells = useRef<HTMLInputElement[]>(Array(length).fill(null));

  const handleCellRef = useCallback(
    (i: number, cellRef: HTMLInputElement | null) => {
      if (cellRef) {
        cells.current[i] = cellRef;
      }
    },
    [],
  );

  const handleFocus = useCallback((i: number, value: string) => {
    if (i > value.length + 1) {
      cells.current[value.length].focus();
    }
  }, []);

  const handleChange = useCallback(
    (i: number, value: string, newValue: string | null) => {
      if (newValue !== null) {
        onChange(value + newValue);
        if (i < length - 1) {
          cells.current[i + 1].focus();
        }
      } else {
        onChange(value.slice(0, i - 1));
        if (i > 0) {
          cells.current[i - 1].focus();
        }
      }
    },
    [length, onChange],
  );

  return (
    <div className={styles.container}>
      {Array(length)
        .fill(null)
        .map((_, i) => (
          <input
            className={classNames(
              styles.cell({
                disabled,
                ...(highlights?.[i] && {
                  highlight: highlights[i],
                }),
              }),
              {
                hidden: obscureLength && i >= value.length + 2,
              },
            )}
            key={i}
            ref={(el) => handleCellRef(i, el)}
            value={value[i] ?? ''}
            maxLength={1}
            onChange={(e) => handleChange(i, value, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && i > 0) {
                handleChange(i, value, null);
              }
            }}
            onFocus={() => handleFocus(i, value)}
            disabled={disabled}
          />
        ))}
    </div>
  );
};
