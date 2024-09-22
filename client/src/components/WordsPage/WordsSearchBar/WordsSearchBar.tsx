import React from 'react';
import { BsEraserFill } from 'react-icons/bs';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { PiMagnifyingGlassBold } from 'react-icons/pi';
import { MIN_QUERY_LENGTH } from '../../../utils/constants';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Icon } from '../../common/Icon';
import { Input } from '../../common/Input';
import * as styles from './WordsSearchBar.css';

type WordsSearchBarProps = {
  query: string;
  onQueryChange: (query: string) => void;
  onClear: () => void;
  disabled?: boolean;
};

export const WordsSearchBar: React.FC<WordsSearchBarProps> = ({
  query,
  onQueryChange,
  onClear,
}) => {
  const { t } = useTranslation();
  const isSearch = query.length >= MIN_QUERY_LENGTH;

  return (
    <div className={classNames(styles.wrapper, { highlighted: isSearch })}>
      <div className={styles.iconLeft}>
        <Icon icon={PiMagnifyingGlassBold} />
      </div>
      <Input
        value={query}
        onChange={onQueryChange}
        text="original"
        padding
        placeholder={t('words.search')}
      />
      <ButtonIcon icon={BsEraserFill} onClick={onClear} disabled={!query} />
    </div>
  );
};
