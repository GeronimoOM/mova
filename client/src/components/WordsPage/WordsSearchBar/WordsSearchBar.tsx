import React from 'react';
import { HiMiniXMark } from 'react-icons/hi2';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Icon } from '../../common/Icon';
import { Input } from '../../common/Input';
import * as styles from './WordsSearchBar.css';

type WordsSearchBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
};

export const WordsSearchBar: React.FC<WordsSearchBarProps> = ({
  query,
  onQueryChange,
  onClear,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconLeft}>
        <Icon icon={PiMagnifyingGlassBold} />
      </div>
      <Input
        value={query}
        onChange={onQueryChange}
        text="original"
        size="large"
        padding
      />
      {/* <div className={styles.buttonRight}> */}
      <ButtonIcon icon={HiMiniXMark} onClick={onClear} disabled={!query} />
      {/* </div> */}
    </div>
  );
};
