import { useCallback, useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { FaAngleDoubleRight, FaCheck, FaMinus } from 'react-icons/fa';
import { LinkedWordFieldsFragment } from '../../api/types/graphql';
import { pickN, shuffle } from '../../utils/random';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import { Input } from '../common/Input';
import * as styles from './PickExercise.css';
import { ExerciseWord } from './exercises';

const MAX_OPTIONS = 4;

export type PickExerciseProps = {
  word: ExerciseWord;
  onSuccess: () => void;
  onFailure: () => void;
  onNext: () => void;
};

export const PickExercise = ({
  word,
  onSuccess,
  onFailure,
  onNext,
}: PickExerciseProps) => {
  const [picked, setPicked] = useState<string | null>(null);
  const [isSubmitted, setSubmitted] = useState(false);
  const result = picked === word.id;

  const wordOptions = useMemo(
    () => shuffle([word, ...pickN(word.distinctLinks, MAX_OPTIONS - 1)]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const { t } = useTranslation();

  const handleResult = useCallback(
    (picked: string | null) => {
      const result = picked === word.id;
      setPicked(picked);
      setSubmitted(true);
      if (result) {
        onSuccess();
      } else {
        onFailure();
      }
    },
    [word.id, onSuccess, onFailure],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{t('exercise.pick')}</div>

      <Input
        value={word.translation}
        text="translation"
        size="large"
        disabled
      />

      <div className={styles.options}>
        {wordOptions.map((wordOption) => (
          <PickExerciseOption
            key={wordOption.id}
            word={wordOption}
            outline={isSubmitted && wordOption.id === word.id}
            mark={isSubmitted && wordOption.id === picked ? result : undefined}
            onClick={() => handleResult(wordOption.id)}
            disabled={isSubmitted}
          />
        ))}
      </div>

      <div className={styles.buttons}>
        <ButtonIcon
          icon={!isSubmitted ? FaMinus : FaAngleDoubleRight}
          onClick={isSubmitted ? onNext : () => handleResult(null)}
          {...(!isSubmitted && { color: 'negative' })}
        />
      </div>
    </div>
  );
};

type PickExerciseOptionProps = {
  word: LinkedWordFieldsFragment;
  mark?: boolean;
  outline?: boolean;
  onClick: () => void;
  disabled?: boolean;
};

const PickExerciseOption = ({
  word,
  mark,
  outline,
  onClick,
  disabled,
}: PickExerciseOptionProps) => {
  return (
    <div
      className={styles.option({ outline, disabled })}
      onClick={() => !disabled && onClick()}
    >
      <div className={styles.optionText}>{word.original}</div>
      {mark !== undefined && (
        <Icon
          icon={mark ? FaCheck : FaMinus}
          color={mark ? 'primary' : 'negative'}
        />
      )}
    </div>
  );
};
