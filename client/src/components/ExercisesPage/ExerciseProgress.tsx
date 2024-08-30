import { useQuery } from '@apollo/client';
import React from 'react';
import { GetProgressDocument, ProgressType } from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import { ProgressTypeBar } from '../ProgressPage/ProgressTypeBar';
import * as styles from './ExerciseProgress.css';

export const ExerciseProgress: React.FC = () => {
  const [selectedLanguageId] = useLanguageContext();

  const { data: progressQuery } = useQuery(GetProgressDocument, {
    variables: { languageId: selectedLanguageId!, type: ProgressType.Mastery },
    fetchPolicy: 'cache-and-network',
  });
  const progress = progressQuery?.language?.progress;

  return (
    <div className={styles.wrapper}>
      <ProgressTypeBar type={ProgressType.Mastery} progress={progress} />
    </div>
  );
};
