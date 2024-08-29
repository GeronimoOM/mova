import { useQuery } from '@apollo/client';
import React from 'react';
import { GetStatsDocument } from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import * as styles from './StatsTab.css';

export const StatsTab: React.FC = () => {
  const [selectedLanguageId] = useLanguageContext();

  const { data: statsQuery } = useQuery(GetStatsDocument, {
    variables: { languageId: selectedLanguageId! },
  });
  const stats = statsQuery?.language?.stats;
  const total = stats?.total;
  // const byMastery = stats?.mastery;
  // const byPartOfSpeech = stats?.partsOfSpeech;

  return <div className={styles.wrapper}>Stats: {total} words</div>;
};
