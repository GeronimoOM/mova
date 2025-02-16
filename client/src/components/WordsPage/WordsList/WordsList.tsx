import React from 'react';
import { useTranslation } from 'react-i18next';
import { TbHexagonPlusFilled } from 'react-icons/tb';
import { MIN_QUERY_LENGTH } from '../../../utils/constants';
import { useInfiniteScroll } from '../../../utils/useInfiniteScroll';
import { useLanguageContext } from '../../LanguageContext';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Loader } from '../../common/Loader';
import * as styles from './WordsList.css';
import { WordsListItem, WordsListItemDivider } from './WordsListItem';
import { isDivider, WordDateDivider } from './useWordsList';
import { WordFieldsFragment } from '../../../api/types/graphql';

export type WordsListProps = {
  words: Array<WordFieldsFragment | WordDateDivider> | undefined,
  wordsLoading: boolean;
  wordsSearchQuery: string;
  onFetchNextPage: () => void;
  onSelectWord: (selectedWord: string) => void;
  onCreateNew: () => void;
};

export const WordsList: React.FC<WordsListProps> = ({
  words,
  wordsLoading,
  wordsSearchQuery,
  onFetchNextPage,
  onSelectWord,
  onCreateNew,
}) => {
  const [selectedLanguageId] = useLanguageContext();
  const isSearch = wordsSearchQuery.length >= MIN_QUERY_LENGTH;

  const isEmpty = !words?.length && !wordsLoading;

  const listEndRef = useInfiniteScroll<HTMLDivElement>({
    isFetching: wordsLoading,
    fetchNextPage: onFetchNextPage,
  });

  return (
    <div className={styles.wrapper}>
      {wordsLoading ? (
        <Loader />
      ) : isEmpty ? (
        <NoWords isSearch={isSearch} />
      ) : (
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
      )}

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

type NoWordsProps = {
  isSearch: boolean;
};

const NoWords: React.FC<NoWordsProps> = ({ isSearch }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.noWords}>
      <div>{isSearch ? t('words.empty.search') : t('words.empty.list')}</div>
    </div>
  );
};
