import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLightbulb } from 'react-icons/fa';
import {
  GetWordOverviewDocument,
  WordOverviewFieldsFragment,
} from '../../../api/types/operations';
import * as strings from '../../../utils/strings';
import { Icon } from '../../common/Icon';
import { Loader } from '../../common/Loader';
import { Modal } from '../../common/Modal';
import * as styles from './WordOverviewModal.css';
import { Word } from './useWordDetails';

export type WordOverviewModalProps = {
  word: Word;
  onClose: () => void;
};

export const WordOverviewModal = ({
  word,
  onClose,
}: WordOverviewModalProps) => {
  const { t } = useTranslation();
  const { data: wordOverviewQuery, loading: wordOverviewLoading } = useQuery(
    GetWordOverviewDocument,
    { variables: { id: word.id as string } },
  );
  const wordOverview = wordOverviewQuery?.word?.overview;

  return (
    <Modal onClose={onClose} modalClassName={styles.modal}>
      <div className={styles.wrapper}>
        {wordOverviewLoading ? (
          <Loader />
        ) : wordOverview ? (
          <WordOverviewModalContent word={word} overview={wordOverview} />
        ) : (
          t('error')
        )}
      </div>
    </Modal>
  );
};

type WordOverviewModalContentProps = {
  word: Word;
  overview: WordOverviewFieldsFragment;
};

const WordOverviewModalContent = ({
  word,
  overview,
}: WordOverviewModalContentProps) => {
  const examplesSplitByWord = useMemo(
    () =>
      overview.interpretations.map((interpretation) =>
        strings.splitBy(interpretation.example, interpretation.wordForm),
      ),
    [overview],
  );

  return (
    <div className={styles.list}>
      <div className={styles.title}>{word.original}</div>
      {overview.interpretations.map((interpretation, idx) => (
        <div key={idx} className={styles.listItem}>
          <span>{`${idx + 1}.`}</span>
          <div className={styles.listItemContent}>
            <span className={styles.interpretation}>
              {interpretation.interpretation}
            </span>
            <div className={styles.sentences}>
              <span className={styles.example}>
                {examplesSplitByWord[idx] ? (
                  <>
                    {examplesSplitByWord[idx][0]}
                    <span className={styles.exampleWord}>
                      {examplesSplitByWord[idx][1]}
                    </span>
                    {examplesSplitByWord[idx][2]}
                  </>
                ) : (
                  interpretation.example
                )}
              </span>
              <span className={styles.translation}>
                {interpretation.translation}
              </span>
            </div>
          </div>
        </div>
      ))}
      {overview.extra && (
        <div className={styles.listItem}>
          <div>
            <Icon icon={FaLightbulb} size="small" />
          </div>
          <div className={styles.listItemContent}>
            <span>{overview.extra}</span>
          </div>
        </div>
      )}
    </div>
  );
};
