import { Component, Show, createEffect } from 'solid-js';
import { StatisticsCalendar } from './StatisticsCalendar';
import { createLazyQuery } from '@merged/solid-apollo';
import { GetWordsStatsDocument } from '../../api/types/graphql';
import { useLanguageContext } from '../LanguageContext';

export const StatisticsPage: Component = () => {
  const [selectedLanguageId] = useLanguageContext();

  const [fetchStats, statsQuery] = createLazyQuery(GetWordsStatsDocument);
  const totalStats = () => statsQuery()?.language!.wordsStats.total;
  const byDateStats = () => statsQuery()?.language!.wordsStats.byDate;

  createEffect(() => {
    if (selectedLanguageId()) {
      fetchStats({
        variables: {
          languageId: selectedLanguageId()!,
        },
      });
    }
  });

  return (
    <div class="h-full flex flex-col items-center justify-items-stretch">
      <div class="p-5">Total words: {totalStats()?.words ?? 0}</div>
      <Show when={byDateStats()}>
        <StatisticsCalendar stats={byDateStats()!} />
      </Show>
    </div>
  );
};
