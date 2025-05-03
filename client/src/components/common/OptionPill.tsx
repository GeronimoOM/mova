import { FaUndoAlt } from 'react-icons/fa';
import { FaCircle, FaXmark } from 'react-icons/fa6';

import { useState } from 'react';
import { Option, OptionValue } from '../../api/types/graphql';
import { OptionColor, optionColors } from '../../utils/options';
import { ButtonIcon } from './ButtonIcon';
import { Dropdown } from './Dropdown';
import { Input } from './Input';
import * as styles from './OptionPill.css';

export type OptionPillProps = {
  option: Option | OptionValue | null;
  disabled?: boolean;
  placeholder?: string;
  deleted?: boolean;
  onValueChange?: (value: string) => void;
  onColorChange?: (color: OptionColor | null) => void;
  onDelete?: () => void;
  onRestore?: () => void;
  dataTestId?: string;
};

export const OptionPill = ({
  option,
  disabled,
  placeholder,
  deleted,
  onValueChange,
  onColorChange,
  onDelete,
  onRestore,
  dataTestId,
}: OptionPillProps) => {
  const color = option?.color ?? undefined;
  const empty = !option;
  const isEditable = !deleted && !!onValueChange;

  return (
    <div
      className={styles.option({ color, empty, disabled, deleted })}
      data-testid={dataTestId}
      data-option-color={color?.toLowerCase() ?? 'empty'}
    >
      <Input
        value={option ? option.value : '   '}
        placeholder={placeholder}
        onChange={onValueChange}
        disabled={!isEditable || deleted}
        textColor={color}
        ghost
        dynamicWidth
        maxLength={30}
      />

      {(onColorChange || onDelete || onRestore) && (
        <div className={styles.buttons}>
          {onColorChange && (
            <OptionColorPicker
              color={option?.color ?? null}
              onPick={onColorChange}
            />
          )}

          {onDelete && !deleted && (
            <ButtonIcon
              icon={FaXmark}
              onClick={onDelete}
              size={'tiny'}
              borderless
              dataTestId="option-delete-btn"
            />
          )}

          {onRestore && deleted && (
            <div className={styles.restore}>
              <ButtonIcon
                icon={FaUndoAlt}
                onClick={onRestore}
                size={'tiny'}
                borderless
                dataTestId="option-restore-btn"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

type OptionColorPickerProps = {
  color: OptionColor | null;
  onPick: (color: OptionColor | null) => void;
};

const OptionColorPicker = ({ color, onPick }: OptionColorPickerProps) => {
  const [isOpen, setOpen] = useState(false);

  const handlePick = (color: OptionColor | null) => {
    onPick(color);
    setOpen(false);
  };

  return (
    <Dropdown
      isOpen={isOpen}
      onOpen={setOpen}
      content={
        <div className={styles.colors}>
          {[null, ...optionColors].map((optionColor) => (
            <ButtonIcon
              key={optionColor}
              icon={FaCircle}
              onClick={() => handlePick(optionColor)}
              size={'small'}
              borderless
              color={optionColor ?? undefined}
              highlightedAlt
              toggled={optionColor === color}
              dataTestId={`option-color-picker-option-${optionColor?.toLowerCase() ?? 'empty'}`}
            />
          ))}
        </div>
      }
    >
      <ButtonIcon
        icon={FaCircle}
        onClick={() => setOpen(!isOpen)}
        size={'tiny'}
        borderless
        color={color ?? undefined}
        highlightedAlt
        dataTestId="option-color-picker"
      />
    </Dropdown>
  );
};
