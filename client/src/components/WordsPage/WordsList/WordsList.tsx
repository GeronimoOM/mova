import { useTranslation } from 'react-i18next';
import { TbHexagonPlusFilled } from 'react-icons/tb';
import { WordFieldsFragment } from '../../../api/types/graphql';
import { MIN_QUERY_LENGTH } from '../../../utils/constants';
import { useInfiniteScroll } from '../../../utils/useInfiniteScroll';
import { ButtonIcon } from '../../common/ButtonIcon';
import { Loader } from '../../common/Loader';
import * as styles from './WordsList.css';
import { WordsListItem, WordsListItemDivider } from './WordsListItem';
import { isDivider, WordDateDivider } from './useWordsList';

export type WordsListProps = {
  words: Array<WordFieldsFragment | WordDateDivider> | undefined;
  wordsLoading: boolean;
  wordsSearchQuery: string;
  onFetchNextPage: () => void;
  onSelectWord: (selectedWord: string) => void;
  onCreateNew: () => void;
};

export const WordsList = ({
  words,
  wordsLoading,
  wordsSearchQuery,
  onFetchNextPage,
  onSelectWord,
  onCreateNew,
}: WordsListProps) => {
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
        <div className={styles.list} data-testid="words-list">
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
          dataTestId="words-create-btn"
        />
      </div>
    </div>
  );
};

type NoWordsProps = {
  isSearch: boolean;
};

const NoWords = ({ isSearch }: NoWordsProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.noWords}>
      <div>{isSearch ? t('words.empty.search') : t('words.empty.list')}</div>
    </div>
  );
};
