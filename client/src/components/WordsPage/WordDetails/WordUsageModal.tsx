import { useQuery } from '@apollo/client/react';
import { useTranslation } from 'react-i18next';
import { FaLightbulb } from 'react-icons/fa';
import {
  GetWordUsageDocument,
  WordUsageFieldsFragment,
} from '../../../api/types/operations';
import { Icon } from '../../common/Icon';
import { Loader } from '../../common/Loader';
import { Modal } from '../../common/Modal';
import * as styles from './WordUsageModal.css';
import { Word } from './useWordDetails';

export type WordUsageModalProps = {
  word: Word;
  onClose: () => void;
};

export const WordUsageModal = ({ word, onClose }: WordUsageModalProps) => {
  const { t } = useTranslation();
  const { data: wordUsageQuery, loading: wordUsageLoading } = useQuery(
    GetWordUsageDocument,
    { variables: { id: word.id as string } },
  );
  const wordUsage = wordUsageQuery?.word?.usage;

  return (
    <Modal onClose={onClose}>
      <div className={styles.wrapper}>
        {wordUsageLoading ? (
          <Loader />
        ) : wordUsage ? (
          <WordUsageModalContent word={word} usage={wordUsage} />
        ) : (
          t('error')
        )}
      </div>
    </Modal>
  );
};

type WordUsageModalContentProps = {
  word: Word;
  usage: WordUsageFieldsFragment;
};

const WordUsageModalContent = ({ word, usage }: WordUsageModalContentProps) => {
  return (
    <div className={styles.list}>
      <div className={styles.title}>{word.original}</div>
      {usage.interpretations.map((interpretation, idx) => (
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
      {usage.extra && (
        <div className={styles.listItem}>
          <Icon icon={FaLightbulb} />
          <span>{usage.extra}</span>
        </div>
      )}
    </div>
  );
};
