import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import {
  GetAllProgressDocument,
  ProgressFieldsFragment,
  ProgressType,
} from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';
import { ProgressCalendar } from './ProgressCalendar';
import * as styles from './ProgressTab.css';
import { ProgressTypeBar } from './ProgressTypeBar';
import { ProgressTypes } from './progress';

export const ProgressTab = () => {
  const [selectedLanguageId] = useLanguageContext();
  const { data: progressQuery } = useQuery(GetAllProgressDocument, {
    variables: { languageId: selectedLanguageId! },
    fetchPolicy: 'cache-and-network',
  });
  const progressByType:
    | Record<ProgressType, ProgressFieldsFragment>
    | undefined = useMemo(
    () =>
      progressQuery?.language
        ? {
            [ProgressType.Words]: progressQuery.language.wordsProgress,
            [ProgressType.Mastery]: progressQuery.language.masteryProgress,
          }
        : undefined,
    [progressQuery],
  );

  return (
    <div className={styles.wrapper}>
      {ProgressTypes.map((type) => (
        <ProgressTypeBar
          key={type}
          type={type}
          progress={progressByType?.[type]}
        />
      ))}

      <ProgressCalendar />
    </div>
  );
};
