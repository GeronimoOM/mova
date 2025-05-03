import { DateTime } from 'luxon';
import { WordFieldsFragment } from '../../../api/types/graphql';
import { DISPLAY_DATE_FORMAT } from '../../../utils/constants';
import { useLocaleContext } from '../../LocaleContext';
import * as styles from './WordsListItem.css';

export type WordsListItemProps = {
  word: WordFieldsFragment;
  setSelectedWord: (selectedWord: string) => void;
};

export const WordsListItem = ({
  word,
  setSelectedWord,
}: WordsListItemProps) => {
  return (
    <div
      className={styles.item}
      onClick={() => setSelectedWord(word.id)}
      data-testid="words-list-item"
    >
      <div className={styles.original} data-testid="words-list-item-original">
        {word.original}
      </div>
      <div
        className={styles.translation}
        data-testid="words-list-item-translation"
      >
        {word.translation}
      </div>
    </div>
  );
};

export type WordsListItemDividerProps = {
  date: DateTime;
  total: number;
  isTotalComplete: boolean;
};

const MAX_DIVIDER_TOTAL = 99;

export const WordsListItemDivider = ({
  date,
  total,
  isTotalComplete,
}: WordsListItemDividerProps) => {
  const [locale] = useLocaleContext();

  return (
    <div className={styles.divider}>
      <div className={styles.dividerInner}>
        <div>{date.setLocale(locale).toFormat(DISPLAY_DATE_FORMAT)}</div>
        <div
          className={styles.dividerTotal}
        >{`${Math.min(total, MAX_DIVIDER_TOTAL)}${isTotalComplete ? '' : '+'}`}</div>
      </div>
    </div>
  );
};
