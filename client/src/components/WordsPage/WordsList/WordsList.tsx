import React, { useEffect } from 'react';
import { TbHexagonPlusFilled } from 'react-icons/tb';
import { clearWordsSearch } from '../../../api/cache';
import { useDebouncedValue } from '../../../utils/useDebouncedValue';
import { useInfiniteScroll } from '../../../utils/useInfiniteScroll';
import { useLanguageContext } from '../../LanguageContext';
import { ButtonIcon } from '../../common/ButtonIcon';
import * as styles from './WordsList.css';
import { WordsListItem, WordsListItemDivider } from './WordsListItem';
import { isDivider, useWordsList } from './useWordsList';

const SEARCH_DELAY_MS = 300;

export type WordsListProps = {
  onSelectWord: (selectedWord: string) => void;
  onCreateNew: () => void;
  onOpenDetails: () => void;
  wordsSearchQuery: string;
};

export const WordsList: React.FC<WordsListProps> = ({
  onSelectWord,
  onCreateNew,
  wordsSearchQuery,
}) => {
  const [selectedLanguageId] = useLanguageContext();

  const debouncedWordsSearchQuery = useDebouncedValue(
    wordsSearchQuery,
    SEARCH_DELAY_MS,
  );

  const {
    words,
    wordsLoading: loading,
    fetchNextWordsPage,
  } = useWordsList(debouncedWordsSearchQuery);

  const listEndRef = useInfiniteScroll<HTMLDivElement>({
    isFetching: loading,
    fetchNextPage: fetchNextWordsPage,
  });

  useEffect(() => {
    if (selectedLanguageId) {
      clearWordsSearch(selectedLanguageId);
    }
  }, [selectedLanguageId, debouncedWordsSearchQuery]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        {words?.map((word) =>
          isDivider(word) ? (
            <WordsListItemDivider date={word.date} key={word.date.toString()} />
          ) : (
            <WordsListItem
              key={word.id}
              word={word}
              setSelectedWord={onSelectWord}
            />
          ),
        )}
        <div className={styles.listEnd} key="end" ref={listEndRef} />
      </div>

      <div className={styles.buttons}>
        <ButtonIcon
          icon={TbHexagonPlusFilled}
          type="primary"
          onClick={onCreateNew}
        />
      </div>
    </div>
  );
};
