import { useQuery } from '@apollo/client/react';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLightbulb, FaUndoAlt } from 'react-icons/fa';
import { HiMiniXMark } from 'react-icons/hi2';
import { useResetWordOverview } from '../../../api/mutations';
import {
  GetWordOverviewDocument,
  WordOverviewFieldsFragment,
} from '../../../api/types/operations';
import { WordOverviewInterpretation } from '../../../api/types/schema';
import * as strings from '../../../utils/strings';
import { ButtonIcon } from '../../common/ButtonIcon';
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

  const [resetWordOverviewMutate, { loading: wordOverviewResetting }] =
    useResetWordOverview();
  const resetWordOverview = useCallback(
    () =>
      resetWordOverviewMutate({
        variables: {
          id: word.id!,
        },
      }),
    [],
  );
  const loading = wordOverviewLoading || wordOverviewResetting;

  return (
    <Modal onClose={onClose} modalClassName={styles.modal}>
      <div className={styles.wrapper}>
        {loading ? (
          <Loader />
        ) : wordOverview ? (
          <WordOverviewModalContent
            word={word}
            overview={wordOverview}
            onClose={onClose}
            onReset={resetWordOverview}
          />
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
  onClose: () => void;
  onReset: () => void;
};

const WordOverviewModalContent = ({
  word,
  overview,
  onClose,
  onReset,
}: WordOverviewModalContentProps) => {
  return (
    <div className={styles.list}>
      <div className={styles.titleRow}>
        <ButtonIcon icon={FaUndoAlt} onClick={onReset} />
        <div className={styles.title}>{word.original}</div>
        <ButtonIcon icon={HiMiniXMark} onClick={onClose} />
      </div>

      {overview.interpretations.map((interpretation, idx) => (
        <WordOverviewModalInterpretation
          key={idx}
          index={idx}
          interpretation={interpretation}
        />
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

type WordOverviewModalInterpretationProps = {
  index: number;
  interpretation: WordOverviewInterpretation;
};

const WordOverviewModalInterpretation = ({
  index,
  interpretation,
}: WordOverviewModalInterpretationProps) => {
  const exampleParts = useMemo(
    () => strings.splitBy(interpretation.example, interpretation.wordForm),
    [interpretation],
  );
  const [exampleBefore, exampleWord, exampleAfter] = exampleParts ?? [];

  return (
    <div className={styles.listItem}>
      <span>{`${index + 1}.`}</span>
      <div className={styles.listItemContent}>
        <span>{interpretation.interpretation}</span>
        <div className={styles.sentences}>
          <span className={styles.example}>
            {exampleParts ? (
              <>
                {exampleBefore}
                <span className={styles.exampleWord}>{exampleWord}</span>
                {exampleAfter}
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
  );
};
