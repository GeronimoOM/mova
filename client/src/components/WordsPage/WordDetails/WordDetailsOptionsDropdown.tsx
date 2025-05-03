import { useState } from 'react';
import { ImCheckmark } from 'react-icons/im';
import {
  OptionPropertyFieldsFragment,
  OptionValue,
  UpdatePropertyValueOptionInput,
} from '../../../api/types/graphql';
import { OptionPill } from '../../common/OptionPill';

import { useTranslation } from 'react-i18next';
import { HiMiniXMark } from 'react-icons/hi2';
import { ButtonIcon } from '../../common/ButtonIcon';
import * as styles from './WordDetailsOptionsDropdown.css';

export type WordDetailsOptionDropdownProps = {
  property: OptionPropertyFieldsFragment;
  selected: OptionValue | null;
  onSelect: (option: UpdatePropertyValueOptionInput | null) => void;
  onClose: () => void;
};

export const WordDetailsOptionDropdown = ({
  property,
  selected,
  onSelect,
  onClose,
}: WordDetailsOptionDropdownProps) => {
  const { t } = useTranslation();

  const [rawOption, setRawOption] = useState<OptionValue>(
    selected && !selected.id ? selected : { value: '', color: null },
  );

  const handleSelect = (option: OptionValue | null) => {
    onSelect(option);
    onClose();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.options}>
        <ButtonIcon
          icon={HiMiniXMark}
          onClick={() => handleSelect(null)}
          size={'small'}
          dataTestId="word-details-options-clear-btn"
        />

        {property.options.map((option) => (
          <div
            key={option.id}
            onClick={() =>
              handleSelect({
                id: option.id,
                value: option.value,
                color: option.color,
              })
            }
          >
            <OptionPill
              option={option}
              dataTestId="word-details-options-option"
            />
          </div>
        ))}
      </div>

      <div className={styles.rawOption}>
        <OptionPill
          option={rawOption}
          placeholder={t('words.options.custom')}
          onValueChange={(value) => setRawOption({ ...rawOption, value })}
          onColorChange={(color) => setRawOption({ ...rawOption, color })}
          dataTestId="word-details-options-custom"
        />
        <ButtonIcon
          icon={ImCheckmark}
          onClick={() =>
            handleSelect({
              id: null,
              value: rawOption.value,
              color: rawOption.color,
            })
          }
          size={'small'}
          disabled={!rawOption.value}
          dataTestId="word-details-options-custom-save-btn"
        />
      </div>
    </div>
  );
};
