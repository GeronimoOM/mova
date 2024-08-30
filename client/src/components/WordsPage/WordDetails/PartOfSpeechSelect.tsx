import React, { useRef, useState } from 'react';
import { PiGraphBold } from 'react-icons/pi';
import { PartOfSpeech } from '../../../api/types/graphql';
import { partsOfSpeech } from '../../../utils/partsOfSpeech';
import { useClickOutsideHandler } from '../../../utils/useClickOutsideHandler';
import { Icon } from '../../common/Icon';
import * as styles from './PartOfSpeechSelect.css';

export type PartOfSpeechSelectProps = {
  partOfSpeech: PartOfSpeech | null;
  onPartOfSpeechSelect: (partOfSpeech: PartOfSpeech) => void;
  disabled?: boolean;
};

export const PartOfSpeechSelect: React.FC<PartOfSpeechSelectProps> = ({
  partOfSpeech,
  onPartOfSpeechSelect,
  disabled,
}) => {
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

const PartOfSpeechSelectButton: React.FC<PartOfSpeechSelectButtonProps> = ({
  partOfSpeech,
  onOpenDropdown: onOpen,
  disabled,
}) => {
  return (
    <div className={styles.button({ disabled })} onClick={onOpen}>
      <Icon icon={PiGraphBold} size="small" />
      {partOfSpeech ? (
        <span>{partOfSpeech}</span>
      ) : (
        <span className={styles.placeholder}>select</span>
      )}
    </div>
  );
};

type PartOfSpeechSelectDropdownProps = {
  onPartOfSpeechSelect: (partOfSpeech: PartOfSpeech) => void;
};

const PartOfSpeechSelectDropdown: React.FC<PartOfSpeechSelectDropdownProps> = ({
  onPartOfSpeechSelect,
}) => {
  return (
    <div className={styles.dropdown}>
      {partsOfSpeech.map((partOfSpeech) => (
        <div
          key={partOfSpeech}
          className={styles.dropdownItem}
          onClick={() => onPartOfSpeechSelect(partOfSpeech)}
        >
          {partOfSpeech}
        </div>
      ))}
    </div>
  );
};
