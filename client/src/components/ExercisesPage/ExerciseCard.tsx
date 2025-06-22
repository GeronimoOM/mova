import { NetworkStatus, useLazyQuery, useQuery } from '@apollo/client';
import { useMemo, useState } from 'react';
import { FaInfo } from 'react-icons/fa';
import { HiMiniXMark } from 'react-icons/hi2';

import { useTranslation } from 'react-i18next';
import { IoPlay } from 'react-icons/io5';
import { useAttemptWordMastery } from '../../api/mutations';
import {
  GetExerciseCountDocument,
  GetExerciseWordsDocument,
  GetPropertiesDocument,
  PropertyFieldsFragment,
} from '../../api/types/graphql';
import { toGroupedRecord } from '../../utils/arrays';
import { useLanguageContext } from '../LanguageContext';
import { WordDetails } from '../WordsPage/WordDetails/WordDetails';
import { ButtonIcon } from '../common/ButtonIcon';
import { Loader } from '../common/Loader';
import * as styles from './ExerciseCard.css';
import { PickExercise } from './PickExercise';
import { RecallExercise } from './RecallExercise';
import { SpellExercise } from './SpellExercise';
import { ExerciseWord } from './exercises';

export const ExerciseCard = () => {
  const [selectedLanguageId] = useLanguageContext();

  const [isStarted, setIsStarted] = useState(false);
  const [wordIndex, setWordIndex] = useState(-1);
  const [isInfoAvailable, setInfoAvailable] = useState(false);
  const [isInfoOpen, setInfoOpen] = useState(false);

  const { data: propertiesQuery, loading: propertiesLoading } = useQuery(
    GetPropertiesDocument,
    {
      variables: { languageId: selectedLanguageId! },
    },
  );
  const { data: exerciseCountQuery, loading: exerciseCountLoading } = useQuery(
    GetExerciseCountDocument,
    {
      variables: { languageId: selectedLanguageId! },
      fetchPolicy: 'no-cache',
    },
  );
  const [
    fetchExerciseWords,
    {
      data: exerciseWordsQuery,
      networkStatus: fetchingExerciseWordsStatus,
      refetch: refetchExerciseWords,
    },
  ] = useLazyQuery(GetExerciseWordsDocument, {
    variables: { languageId: selectedLanguageId! },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [attemptMastery] = useAttemptWordMastery();

  const exerciseCount = exerciseCountQuery?.language?.exerciseCount;
  const wordsLoading = [NetworkStatus.loading, NetworkStatus.refetch].includes(
    fetchingExerciseWordsStatus,
  );
  const loading = propertiesLoading || exerciseCountLoading || wordsLoading;
  const words = exerciseWordsQuery?.language?.exerciseWords;
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
    if (words) {
      refetchExerciseWords();
    } else {
      fetchExerciseWords();
    }
    setWordIndex(0);
    setInfoOpen(false);
  };

  const handleNext = () => {
    if (hasNext) {
      setWordIndex(wordIndex + 1);
    } else {
      handleStart();
    }
    setInfoAvailable(false);
    setInfoOpen(false);
  };

  const handleSuccess = () => {
    setInfoAvailable(true);
    attemptMastery({
      variables: { wordId: currentWord!.id, success: true },
    });
  };

  const handleFailure = () => {
    setInfoAvailable(true);
    attemptMastery({
      variables: { wordId: currentWord!.id, success: false },
    });
  };

  const handleClose = () => {
    if (isInfoOpen) {
      setInfoOpen(false);
    } else {
      setIsStarted(false);
    }
  };

  return (
    <div className={styles.card}>
      {isStarted ? (
        loading ? (
          <Loader />
        ) : currentWord ? (
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

              {isInfoOpen && currentWord && (
                <WordDetailsOverlay
                  wordId={currentWord.id}
                  onClose={() => setInfoOpen(false)}
                />
              )}
            </div>

            <div className={styles.bottom}>
              <ButtonIcon
                icon={FaInfo}
                onClick={() => setInfoOpen(!isInfoOpen)}
                disabled={!isInfoAvailable}
                toggled={isInfoOpen}
              />

              <ButtonIcon
                icon={HiMiniXMark}
                color="negative"
                onClick={handleClose}
              />
            </div>
          </>
        ) : (
          <ExercisesNotReady />
        )
      ) : (
        <ExerciseStart
          loading={loading}
          exerciseCount={exerciseCount}
          onStart={handleStart}
        />
      )}
    </div>
  );
};

type ExerciseStartProps = {
  loading: boolean;
  exerciseCount?: number;
  onStart: () => void;
};

const ExerciseStart = ({
  loading,
  exerciseCount,
  onStart,
}: ExerciseStartProps) => {
  const { t } = useTranslation();

  if (loading) {
    return <Loader />;
  }

  if (!exerciseCount) {
    return <ExercisesNotReady />;
  }

  return (
    <div className={styles.centered}>
      <ButtonIcon
        icon={IoPlay}
        color="primary"
        highlighted={true}
        onClick={onStart}
      />

      <div className={styles.exercisesReady}>
        <div className={styles.exercisesReadyNumber}>{exerciseCount}</div>
        {t('exercise.ready', { count: exerciseCount })}
      </div>
    </div>
  );
};

const ExercisesNotReady = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.centered}>
      <div className={styles.noWordsTitle}>{t('exercise.empty.title')}</div>
      <div className={styles.noWordsDescription}>
        {t('exercise.empty.description')}
      </div>
    </div>
  );
};

type ExerciseProps = {
  word: ExerciseWord;
  properties: PropertyFieldsFragment[];
  onSuccess: () => void;
  onFailure: () => void;
  onNext: () => void;
};

const Exercise = ({
  word,
  properties,
  onSuccess,
  onFailure,
  onNext,
}: ExerciseProps) => {
  const [mastery] = useState(word.mastery);
  if (mastery === 0) {
    if (word.distinctLinks.length) {
      return (
        <PickExercise
          word={word}
          onSuccess={onSuccess}
          onFailure={onFailure}
          onNext={onNext}
        />
      );
    } else {
      return (
        <RecallExercise
          word={word}
          onSuccess={onSuccess}
          onFailure={onFailure}
          onNext={onNext}
        />
      );
    }
  } else {
    return (
      <SpellExercise
        word={word}
        properties={properties}
        onSuccess={onSuccess}
        onFailure={onFailure}
        onNext={onNext}
        advanced={mastery > 1}
      />
    );
  }
};

type WordDetailsOverlayProps = {
  wordId: string;
  onClose: () => void;
};

const WordDetailsOverlay = ({ wordId, onClose }: WordDetailsOverlayProps) => {
  return (
    <div className={styles.details}>
      <WordDetails
        wordId={wordId}
        onSelectWord={() => {}}
        onClose={onClose}
        disabled
      />
    </div>
  );
};
