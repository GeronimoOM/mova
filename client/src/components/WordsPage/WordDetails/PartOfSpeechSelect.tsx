import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PiGraphBold } from 'react-icons/pi';
import { PartOfSpeech } from '../../../api/types/graphql';
import {
  partOfSpeechToShortLabel,
  partsOfSpeech,
} from '../../../utils/partsOfSpeech';
import { useClickOutsideHandler } from '../../../utils/useClickOutsideHandler';
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
  const selectRef = useRef<HTMLDivElement>(null);

  const handlePartOfSpeechSelect = (partOfSpeech: PartOfSpeech) => {
    onPartOfSpeechSelect(partOfSpeech);
    setIsDropdownOpen(false);
  };

  useClickOutsideHandler({
    ref: selectRef,
    onClick: () => setIsDropdownOpen(false),
  });

  return (
    <div className={styles.wrapper} ref={selectRef}>
      <PartOfSpeechSelectButton
        partOfSpeech={partOfSpeech}
        onOpenDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={disabled}
      />

      {isDropdownOpen && (
        <PartOfSpeechSelectDropdown
          onPartOfSpeechSelect={handlePartOfSpeechSelect}
        />
      )}
    </div>
  );
};

type PartOfSpeechSelectButtonProps = {
  partOfSpeech: PartOfSpeech | null;
  onOpenDropdown: () => void;
  disabled?: boolean;
};

const PartOfSpeechSelectButton = ({
  partOfSpeech,
  onOpenDropdown,
  disabled,
}: PartOfSpeechSelectButtonProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.button({ disabled })} onClick={onOpenDropdown}>
      <Icon icon={PiGraphBold} size="small" />
      {partOfSpeech ? (
        <div>{t(partOfSpeechToShortLabel[partOfSpeech])}</div>
      ) : (
        <div className={styles.placeholder}>{t('pos.select')}</div>
      )}
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
        >
          {t(partOfSpeechToShortLabel[partOfSpeech])}
        </div>
      ))}
    </div>
  );
};
