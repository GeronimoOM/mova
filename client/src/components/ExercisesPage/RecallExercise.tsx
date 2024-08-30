import { BsTranslate } from 'react-icons/bs';
import { WordFieldsFullFragment } from '../../api/types/graphql';

import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { FaCheck, FaMinus } from 'react-icons/fa';
import { FaEye } from 'react-icons/fa6';

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

  const handleSuccess = useCallback(() => {
    onSuccess();
    onNext();
  }, [onNext, onSuccess]);

  const handleFailure = useCallback(() => {
    onFailure();
    onNext();
  }, [onFailure, onNext]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>recall the translation</div>

      <Input value={word.original} size="large" onChange={() => {}} disabled />

      <div className={styles.translationLabel}>
        <Icon icon={BsTranslate} size="small" />
        {'translation'}
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
          onChange={() => {}}
          disabled
          obscured={!isRevealed}
        />

        <ButtonIcon
          icon={FaEye}
          onClick={() => setIsRevealed(true)}
          disabled={isRevealed}
        />
      </div>

      <div className={styles.result}>
        <ButtonIcon
          icon={FaCheck}
          onClick={handleSuccess}
          color="primary"
          highlighted={true}
        />

        <ButtonIcon icon={FaMinus} onClick={handleFailure} color="negative" />
      </div>
    </div>
  );
};
