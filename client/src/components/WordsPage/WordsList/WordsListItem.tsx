import { DateTime } from 'luxon';
import React from 'react';
import { WordFieldsFragment } from '../../../api/types/graphql';
import { DISPLAY_DATE_FORMAT } from '../../../utils/constants';
import { useLocaleContext } from '../../LocaleContext';
import * as styles from './WordsListItem.css';

export type WordsListItemProps = {
  word: WordFieldsFragment;
  setSelectedWord: (selectedWord: string) => void;
};

export const WordsListItem: React.FC<WordsListItemProps> = ({
  word,
  setSelectedWord,
}) => {
  return (
    <div className={styles.item} onClick={() => setSelectedWord(word.id)}>
      <div className={styles.original}>{word.original}</div>
      <div className={styles.translation}>{word.translation}</div>
    </div>
  );
};

export type WordsListItemDividerProps = {
  date: DateTime;
  total: number;
  isTotalComplete: boolean;
};

const MAX_DIVIDER_TOTAL = 99;

export const WordsListItemDivider: React.FC<WordsListItemDividerProps> = ({
  date,
  total,
  isTotalComplete,
}) => {
  const [locale] = useLocaleContext();

  return (
    <div className={styles.divider}>
      <div>{date.setLocale(locale).toFormat(DISPLAY_DATE_FORMAT)}</div>
      <div
        className={styles.dividerTotal}
      >{`${Math.min(total, MAX_DIVIDER_TOTAL)}${isTotalComplete ? '' : '+'}`}</div>
    </div>
  );
};
