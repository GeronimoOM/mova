import React from 'react';
import { useInfiniteScroll } from '../../common/useInfiniteScroll';
import * as styles from './WordsList.css';
import { WordsListItem, WordsListItemDivider } from './WordsListItem';
import { isDivider, useWordsList } from './useWordsList';

export type WordsListProps = {
  onSelectWord: (selectedWord: string | null) => void;
  onOpenDetails: () => void;
  wordsSearchQuery: string;
};

export const WordsList: React.FC<WordsListProps> = ({
  onSelectWord,
  wordsSearchQuery,
}) => {
  const {
    words,
    wordsLoading: loading,
    fetchNextWordsPage,
  } = useWordsList(wordsSearchQuery);

  const listEndRef = useInfiniteScroll<HTMLDivElement>({
    isFetching: loading,
    fetchNextPage: fetchNextWordsPage,
  });

  return (
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
  );
};
