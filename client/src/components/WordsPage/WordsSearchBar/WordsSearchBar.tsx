import React from 'react';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { TbHexagonPlusFilled } from 'react-icons/tb';

import { ButtonIcon } from '../../common/ButtonIcon';
import { Icon } from '../../common/Icon';
import { Input } from '../../common/Input';
import * as styles from './WordsSearchBar.css';

type WordsSearchBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onCreateNew: () => void;
};

export const WordsSearchBar: React.FC<WordsSearchBarProps> = ({
  query,
  onQueryChange,
  onCreateNew,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>
        <Icon icon={PiMagnifyingGlassBold} />
      </div>
      <Input
        value={query}
        onChange={onQueryChange}
        text={'original'}
        size={'large'}
        icon={true}
      />
      <ButtonIcon icon={TbHexagonPlusFilled} onClick={onCreateNew} />
    </div>
  );
};
