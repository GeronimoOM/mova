import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PiGraphBold } from 'react-icons/pi';
import { PartOfSpeech } from '../../../api/types/graphql';
import {
  partOfSpeechToShortLabel,
  partsOfSpeech,
} from '../../../utils/partsOfSpeech';
import { Dropdown } from '../../common/Dropdown';
import { Icon } from '../../common/Icon';
import * as styles from './PartOfSpeechSelect.css';

export type PartOfSpeechSelectProps = {
  partOfSpeech: PartOfSpeech | null;
  onPartOfSpeechSelect: (partOfSpeech: PartOfSpeech) => void;
  disabled?: boolean;
};

export const PartOfSpeechSelect = ({
  partOfSpeech,
  onPartOfSpeechSelect,
  disabled,
}: PartOfSpeechSelectProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownOpen = (isOpen: boolean) => {
    if (!disabled) {
      setIsDropdownOpen(isOpen);
    }
  };

  const handlePartOfSpeechSelect = (partOfSpeech: PartOfSpeech) => {
    onPartOfSpeechSelect(partOfSpeech);
    setIsDropdownOpen(false);
  };

  return (
    <Dropdown
      isOpen={isDropdownOpen}
      onOpen={handleDropdownOpen}
      content={
        <PartOfSpeechSelectDropdown
          onPartOfSpeechSelect={handlePartOfSpeechSelect}
        />
      }
      position="bottom"
      alignment="stretch"
      outline="bold"
    >
      <PartOfSpeechSelectButton
        partOfSpeech={partOfSpeech}
        disabled={disabled}
      />
    </Dropdown>
  );
};

type PartOfSpeechSelectButtonProps = {
  partOfSpeech: PartOfSpeech | null;
  disabled?: boolean;
};

const PartOfSpeechSelectButton = ({
  partOfSpeech,
  disabled,
}: PartOfSpeechSelectButtonProps) => {
  const { t } = useTranslation();

  return (
    <div
      className={styles.button({ disabled })}
      data-testid="part-of-speech-select"
    >
      <Icon icon={PiGraphBold} size="small" />
      <div className={styles.buttonText}>
        {partOfSpeech ? (
          <div>{t(partOfSpeechToShortLabel[partOfSpeech])}</div>
        ) : (
          <div className={styles.placeholder}>{t('pos.select')}</div>
        )}
      </div>
    </div>
  );
};

type PartOfSpeechSelectDropdownProps = {
  onPartOfSpeechSelect: (partOfSpeech: PartOfSpeech) => void;
};

const PartOfSpeechSelectDropdown = ({
  onPartOfSpeechSelect,
}: PartOfSpeechSelectDropdownProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.dropdown}>
      {partsOfSpeech.map((partOfSpeech) => (
        <div
          key={partOfSpeech}
          className={styles.dropdownItem}
          onClick={() => onPartOfSpeechSelect(partOfSpeech)}
          data-testid={`part-of-speech-option-${partOfSpeech.toLowerCase()}`}
        >
          {t(partOfSpeechToShortLabel[partOfSpeech])}
        </div>
      ))}
    </div>
  );
};
