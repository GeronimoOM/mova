import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { FaLightbulb } from 'react-icons/fa';
import {
  GetWordOverviewDocument,
  WordOverviewFieldsFragment,
} from '../../../api/types/operations';
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
    <Modal onClose={onClose}>
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
            <span className={styles.example}>{interpretation.example}</span>
            <span className={styles.translation}>
              {interpretation.translation}
            </span>
          </div>
        </div>
      ))}
      {overview.extra && (
        <div className={styles.listItem}>
          <Icon icon={FaLightbulb} />
          <span>{overview.extra}</span>
        </div>
      )}
    </div>
  );
};
