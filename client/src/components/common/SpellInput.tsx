import classNames from 'classnames';
import { useCallback, useRef } from 'react';
import { Color } from '../../index.css';
import * as styles from './SpellInput.css';

const OBSCURED_LENGTH = 100;

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
    (
      i: number,
      value: string,
      newValue: string | null,
      selectionStart: number | null,
    ) => {
      if (newValue === '') {
        return;
      }

      if (newValue) {
        newValue = selectionStart === 1 ? newValue[0] : newValue[1];
        const insertIndex = selectionStart === 1 ? i : i + 1;
        onChange(
          (
            value.slice(0, insertIndex) +
            newValue +
            value.slice(insertIndex)
          ).slice(0, length),
        );
        if (insertIndex < length - 1) {
          cells.current[insertIndex + 1].focus();
        }
      } else {
        const removeIndex = selectionStart === 0 ? i - 1 : i;
        onChange(value.slice(0, removeIndex) + value.slice(removeIndex + 1));
        if (removeIndex >= 0) {
          cells.current[removeIndex].focus();
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
                muted: obscureLength && i === value.length + 1,
                hidden: obscureLength && i >= value.length + 2,
              },
            )}
            key={i}
            ref={(el) => handleCellRef(i, el)}
            value={value[i] ?? ''}
            maxLength={2}
            onChange={(e) =>
              handleChange(i, value, e.target.value, e.target.selectionStart)
            }
            onKeyDown={(e) => {
              const selectionStart = (
                e.target as unknown as { selectionStart: number }
              ).selectionStart;

              if (e.key === 'Backspace' && i > 0) {
                handleChange(i, value, null, selectionStart);
              } else if (
                e.key === 'ArrowLeft' &&
                i > 0 &&
                selectionStart === 0
              ) {
                cells.current[i - 1].focus();
              } else if (
                e.key === 'ArrowRight' &&
                i < length - 1 &&
                selectionStart === 1
              ) {
                cells.current[i + 1].focus();
              }
            }}
            onFocus={() => handleFocus(i, value)}
            disabled={disabled}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
          />
        ))}
    </div>
  );
};
