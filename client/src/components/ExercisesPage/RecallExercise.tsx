import { BsTranslate } from 'react-icons/bs';

import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { FaAngleDoubleRight, FaCheck, FaMinus } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';

import { useTranslation } from 'react-i18next';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import { Input } from '../common/Input';
import * as styles from './RecallExercise.css';
import { ExerciseWord } from './exercises';

export type RecallExerciseProps = {
  word: ExerciseWord;
  onSuccess: () => void;
  onFailure: () => void;
  onNext: () => void;
};

export const RecallExercise = ({
  word,
  onSuccess,
  onFailure,
  onNext,
}: RecallExerciseProps) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const isSubmitted = result !== null;

  const { t } = useTranslation();

  const handleSuccess = useCallback(() => {
    setResult(true);
    setIsRevealed(true);
    onSuccess();
  }, [onSuccess]);

  const handleFailure = useCallback(() => {
    setResult(false);
    setIsRevealed(true);
    onFailure();
  }, [onFailure]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title} data-testid="exercise-title">
        {t('exercise.recall')}
      </div>

      <Input
        value={word.original}
        size="large"
        disabled
        dataTestId="exercise-word"
      />

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
            dataTestId="recall-exercise-translation"
          />

          <ButtonIcon
            icon={FaEye}
            onClick={() => setIsRevealed(true)}
            disabled={isRevealed}
            dataTestId="recall-exercise-reveal-btn"
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
          dataTestId="exercise-submit-btn"
        />

        <ButtonIcon
          icon={!isSubmitted ? FaMinus : FaAngleDoubleRight}
          onClick={isSubmitted ? onNext : handleFailure}
          {...(!isSubmitted && { color: 'negative' })}
          dataTestId="exercise-skip-btn"
        />
      </div>
    </div>
  );
};
