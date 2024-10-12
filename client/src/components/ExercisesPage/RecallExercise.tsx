import { BsTranslate } from 'react-icons/bs';
import { WordFieldsFullFragment } from '../../api/types/graphql';

import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { FaAngleDoubleRight, FaCheck, FaMinus } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';

import { useTranslation } from 'react-i18next';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import { Input } from '../common/Input';
import * as styles from './RecallExercise.css';

export type RecallExerciseProps = {
  word: WordFieldsFullFragment;
  onSuccess: () => void;
  onFailure: () => void;
  onNext: () => void;
};

export const RecallExercise: React.FC<RecallExerciseProps> = ({
  word,
  onSuccess,
  onFailure,
  onNext,
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const isSubmitted = result !== null;

  const { t } = useTranslation();

  const handleSuccess = useCallback(() => {
    setResult(true);
    onSuccess();
  }, [onSuccess]);

  const handleFailure = useCallback(() => {
    setResult(false);
    onFailure();
  }, [onFailure]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{t('exercise.recall')}</div>

      <Input value={word.original} size="large" disabled />

      <div className={styles.translation}>
        <div className={styles.translationLabel}>
          <Icon icon={BsTranslate} size="small" />
          {t('exercise.translation')}
        </div>

        <div
          className={classNames(
            styles.translationRow,
            classNames({ revealed: isRevealed }),
          )}
        >
          <Input
            value={word.translation}
            text="translation"
            size="large"
            disabled
            obscured={!isRevealed}
          />

          <ButtonIcon
            icon={FaEye}
            onClick={() => setIsRevealed(true)}
            disabled={isRevealed}
          />
        </div>
      </div>

      <div className={styles.result}>
        <ButtonIcon
          icon={!isSubmitted || result ? FaCheck : FaMinus}
          color={!isSubmitted || result ? 'primary' : 'negative'}
          onClick={handleSuccess}
          disabled={isSubmitted}
          toggled={isSubmitted}
        />

        <ButtonIcon
          icon={!isSubmitted ? FaMinus : FaAngleDoubleRight}
          onClick={isSubmitted ? onNext : handleFailure}
          {...(!isSubmitted && { color: 'negative' })}
        />
      </div>
    </div>
  );
};
