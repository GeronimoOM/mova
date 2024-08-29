import { useLazyQuery, useQuery } from '@apollo/client';
import React, { useMemo, useState } from 'react';
import { HiMiniXMark } from 'react-icons/hi2';
import { IoPlay } from 'react-icons/io5';
import { useIncreaseWordMastery } from '../../api/mutations';
import {
  GetExerciseWordsDocument,
  GetPropertiesDocument,
  PropertyFieldsFragment,
  WordFieldsFullFragment,
} from '../../api/types/graphql';
import { toGroupedRecord } from '../../utils/arrays';
import { useLanguageContext } from '../LanguageContext';
import { ButtonIcon } from '../common/ButtonIcon';
import * as styles from './ExerciseCard.css';
import { RecallExercise } from './RecallExercise';
import { SpellExercise } from './SpellExercise';
import { ExerciseType, masteryToExerciseType } from './exercises';

type ExerciseProps = {
  word: WordFieldsFullFragment;
  properties: PropertyFieldsFragment[];
  onSuccess: () => void;
  onFailure: () => void;
  onNext: () => void;
};

const Exercise: React.FC<ExerciseProps> = ({
  word,
  properties,
  onSuccess,
  onFailure,
  onNext,
}) => {
  const exerciseType = masteryToExerciseType[word.mastery];
  switch (exerciseType) {
    case ExerciseType.Recall:
      return (
        <RecallExercise
          word={word}
          onSuccess={onSuccess}
          onFailure={onFailure}
          onNext={onNext}
        />
      );
    case ExerciseType.Spell:
    case ExerciseType.SpellAdv:
      return (
        <SpellExercise
          word={word}
          properties={properties}
          onSuccess={onSuccess}
          onFailure={onFailure}
          onNext={onNext}
          advanced={exerciseType === ExerciseType.SpellAdv}
        />
      );
  }
};

const Loader: React.FC = () => {
  return (
    <div className={styles.centered}>
      <ButtonIcon
        icon={IoPlay}
        type="primary"
        onClick={() => {}}
        loading={true}
      />
    </div>
  );
};

export const ExerciseCard: React.FC = () => {
  const [selectedLanguageId] = useLanguageContext();

  const [isStarted, setIsStarted] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  const { data: propertiesQuery, loading: propertiesLoading } = useQuery(
    GetPropertiesDocument,
    {
      variables: { languageId: selectedLanguageId! },
    },
  );
  const [
    fetchExerciseWords,
    {
      data: exerciseWordsQuery,
      loading: wordsLoading,
      refetch: refetchExerciseWords,
    },
  ] = useLazyQuery(GetExerciseWordsDocument, {
    variables: { languageId: selectedLanguageId! },
    fetchPolicy: 'network-only',
  });
  const [increaseMastery] = useIncreaseWordMastery();

  const loading = propertiesLoading || wordsLoading;
  const words = loading
    ? undefined
    : exerciseWordsQuery?.language?.exerciseWords;
  const currentWord = words?.[wordIndex];
  const hasNext = wordIndex + 1 < (words?.length ?? 0);
  const propertiesByPartOfSpeech = useMemo(
    () =>
      propertiesQuery
        ? toGroupedRecord(
            propertiesQuery.language!.properties,
            (property) => property.partOfSpeech,
          )
        : undefined,
    [propertiesQuery],
  );

  const handleStart = () => {
    setIsStarted(true);
    setWordIndex(0);
    words ? refetchExerciseWords() : fetchExerciseWords();
  };

  const handleNext = () => {
    if (hasNext) {
      setWordIndex(wordIndex + 1);
    } else {
      setIsStarted(false);
    }
  };

  const handleSuccess = () => {
    increaseMastery({
      variables: { wordId: currentWord!.id },
    });
  };

  const handleFailure = () => {};

  return (
    <div className={styles.card}>
      {isStarted ? (
        loading ? (
          <Loader />
        ) : (
          <>
            <div className={styles.exercise}>
              <Exercise
                key={currentWord!.id}
                word={currentWord!}
                properties={
                  propertiesByPartOfSpeech![currentWord!.partOfSpeech]
                }
                onSuccess={handleSuccess}
                onFailure={handleFailure}
                onNext={handleNext}
              />
            </div>

            <div className={styles.bottom}>
              <ButtonIcon
                icon={HiMiniXMark}
                type="negative"
                onClick={() => setIsStarted(false)}
              />
            </div>
          </>
        )
      ) : (
        <div className={styles.centered}>
          <ButtonIcon icon={IoPlay} type="primary" onClick={handleStart} />
        </div>
      )}
    </div>
  );
};
