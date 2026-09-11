import { NetworkStatus } from '@apollo/client';
import { useLazyQuery, useQuery } from '@apollo/client/react';
import { useMemo, useRef, useState } from 'react';
import { HiMiniXMark } from 'react-icons/hi2';

import { useTranslation } from 'react-i18next';
import { FaBook } from 'react-icons/fa6';
import { ImArrowUpRight2 } from 'react-icons/im';
import { IoPlay } from 'react-icons/io5';
import { useAttemptMastery } from '../../api/mutations';
import {
  GetExerciseCountDocument,
  GetExerciseWordsDocument,
  GetPropertiesDocument,
  PropertyFieldsFragment,
} from '../../api/types/graphql';
import { wordRoute } from '../../routes';
import { toGroupedRecord } from '../../utils/arrays';
import { useLanguageContext } from '../LanguageContext';
import { LayoutProvider } from '../LayoutContext';
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
  const [isResolved, setResolved] = useState(false);
  const [isDetailsOpen, setDetailsOpen] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const { data: propertiesQuery, loading: propertiesLoading } = useQuery(
    GetPropertiesDocument,
    {
      variables: { languageId: selectedLanguageId! },
    },
  );
  const {
    data: exerciseCountQuery,
    loading: exerciseCountLoading,
    refetch: refetchExerciseCount,
  } = useQuery(GetExerciseCountDocument, {
    variables: { languageId: selectedLanguageId! },
    fetchPolicy: 'no-cache',
  });
  const [
    fetchExerciseWords,
    {
      data: exerciseWordsQuery,
      networkStatus: fetchingExerciseWordsStatus,
      refetch: refetchExerciseWords,
    },
  ] = useLazyQuery(GetExerciseWordsDocument, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const [attemptMastery] = useAttemptMastery();

  const exerciseCount = exerciseCountQuery?.language?.exerciseCount;
  const wordsLoading = [
    NetworkStatus.loading,
    NetworkStatus.setVariables,
    NetworkStatus.refetch,
  ].includes(fetchingExerciseWordsStatus);
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
      fetchExerciseWords({
        variables: { languageId: selectedLanguageId! },
      });
    }
    setWordIndex(0);
    setDetailsOpen(false);
  };

  const handleNext = () => {
    if (hasNext) {
      setWordIndex(wordIndex + 1);
    } else {
      handleStart();
    }
    setResolved(false);
    setDetailsOpen(false);
  };

  const handleSuccess = () => {
    setResolved(true);
    attemptMastery({
      variables: { wordId: currentWord!.id, success: true },
    });
  };

  const handleFailure = () => {
    setResolved(true);
    attemptMastery({
      variables: { wordId: currentWord!.id, success: false },
    });
  };

  const handleClose = () => {
    if (isDetailsOpen) {
      setDetailsOpen(false);
    } else {
      setIsStarted(false);
      refetchExerciseCount();
    }
  };

  const handleOpenInNewTab = () => {
    window.open(wordRoute(currentWord!.id), '_blank');
  };

  return (
    <div className={styles.wrapper} ref={cardRef}>
      {loading ? (
        <Loader />
      ) : !isStarted ? (
        <ExerciseStart exerciseCount={exerciseCount} onStart={handleStart} />
      ) : currentWord ? (
        <ExerciseContent
          currentWord={currentWord}
          properties={propertiesByPartOfSpeech![currentWord!.partOfSpeech]}
          cardRef={cardRef}
          isResolved={isResolved}
          isDetailsOpen={isDetailsOpen}
          handleNext={handleNext}
          handleSuccess={handleSuccess}
          handleFailure={handleFailure}
          handleClose={handleClose}
          handleDetailsOpen={setDetailsOpen}
          handleOpenInNewTab={handleOpenInNewTab}
        />
      ) : (
        <ExercisesNotReady />
      )}
    </div>
  );
};

type ExerciseContentProps = {
  currentWord: ExerciseWord;
  properties: PropertyFieldsFragment[];
  cardRef: React.RefObject<HTMLDivElement | null>;
  isResolved: boolean;
  isDetailsOpen: boolean;
  handleNext: () => void;
  handleSuccess: () => void;
  handleFailure: () => void;
  handleClose: () => void;
  handleDetailsOpen: (isOpen: boolean) => void;
  handleOpenInNewTab: () => void;
};

const ExerciseContent = ({
  currentWord,
  properties,
  cardRef,
  isResolved,
  isDetailsOpen,
  handleNext,
  handleSuccess,
  handleFailure,
  handleClose,
  handleDetailsOpen,
  handleOpenInNewTab,
}: ExerciseContentProps) => {
  return (
    <LayoutProvider containerRef={cardRef}>
      <div className={styles.exercise}>
        <Exercise
          key={currentWord!.id}
          word={currentWord!}
          properties={properties}
          onSuccess={handleSuccess}
          onFailure={handleFailure}
          onNext={handleNext}
        />
      </div>

      <div className={styles.buttons}>
        <ButtonIcon
          icon={FaBook}
          onClick={() => handleDetailsOpen(!isDetailsOpen)}
          disabled={!isResolved}
          toggled={isDetailsOpen}
        />

        <ButtonIcon
          icon={ImArrowUpRight2}
          onClick={handleOpenInNewTab}
          disabled={!isResolved}
        />

        <ButtonIcon icon={HiMiniXMark} color="negative" onClick={handleClose} />
      </div>

      {isDetailsOpen && currentWord && (
        <WordDetailsOverlay
          wordId={currentWord.id}
          onClose={() => handleDetailsOpen(false)}
        />
      )}
    </LayoutProvider>
  );
};

type ExerciseStartProps = {
  exerciseCount?: number;
  onStart: () => void;
};

const ExerciseStart = ({ exerciseCount, onStart }: ExerciseStartProps) => {
  const { t } = useTranslation();

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
        dataTestId="exercises-start-btn"
      />

      <div className={styles.exercisesReady}>
        <div
          className={styles.exercisesReadyNumber}
          data-testid={'exercises-ready-number'}
        >
          {exerciseCount}
        </div>
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
