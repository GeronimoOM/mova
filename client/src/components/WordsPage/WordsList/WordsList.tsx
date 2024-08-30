import React, { useEffect } from 'react';
import { TbHexagonPlusFilled } from 'react-icons/tb';
import { clearWordsSearch } from '../../../api/cache';
import { MIN_QUERY_LENGTH } from '../../../utils/constants';
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
  const isSearch = wordsSearchQuery.length >= MIN_QUERY_LENGTH;

  const debouncedWordsSearchQuery = useDebouncedValue(
    wordsSearchQuery,
    SEARCH_DELAY_MS,
  );

  const { words, wordsLoading, fetchNextWordsPage } = useWordsList(
    debouncedWordsSearchQuery,
  );

  const listEndRef = useInfiniteScroll<HTMLDivElement>({
    isFetching: wordsLoading,
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
            !isSearch && (
              <WordsListItemDivider
                key={word.date.toString()}
                date={word.date}
                total={word.total}
                isTotalComplete={word.isTotalComplete}
              />
            )
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
          color="primary"
          highlighted={true}
          onClick={onCreateNew}
          wrapped
        />
      </div>
    </div>
  );
};
