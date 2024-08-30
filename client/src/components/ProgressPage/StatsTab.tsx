import { useQuery } from '@apollo/client';
import React, { useMemo } from 'react';
import { FaBook, FaBrain } from 'react-icons/fa6';
import { PiGraphBold } from 'react-icons/pi';
import { PieChart } from 'react-minimal-pie-chart';
import { GetStatsDocument } from '../../api/types/graphql';
import { masteries, masteryToColor, masteryToLabel } from '../../utils/mastery';
import { partOfSpeechToColor, partsOfSpeech } from '../../utils/partsOfSpeech';
import { useLanguageContext } from '../LanguageContext';
import { Icon } from '../common/Icon';
import * as styles from './StatsTab.css';

export const StatsTab: React.FC = () => {
  const [selectedLanguageId] = useLanguageContext();

  const { data: statsQuery } = useQuery(GetStatsDocument, {
    variables: { languageId: selectedLanguageId! },
    fetchPolicy: 'network-only',
  });
  const stats = statsQuery?.language?.stats;
  const total = stats?.total;
  const byMastery = stats?.mastery;
  const byPartOfSpeech = stats?.partsOfSpeech;

  const masteryData = useMemo(
    () =>
      masteries.map((mastery) => {
        const data = byMastery?.find((item) => item.mastery === mastery);

        return {
          color: masteryToColor[mastery],
          title: masteryToLabel[mastery],
          value: data?.total ?? 0,
        };
      }),
    [byMastery],
  );

  const partOfSpeechData = useMemo(
    () =>
      partsOfSpeech.map((partOfSpeech) => {
        const data = byPartOfSpeech?.find(
          (item) => item.partOfSpeech === partOfSpeech,
        );

        return {
          color: partOfSpeechToColor[partOfSpeech],
          title: partOfSpeech.toLowerCase(),
          value: data?.total ?? 0,
        };
      }),
    [byPartOfSpeech],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.cardRow}>
          <Icon icon={FaBook} size="small" />
          {'total words'}
          <span className={styles.number}>{total}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardRow}>
          <Icon icon={PiGraphBold} size="small" />
          {'words by part of speech'}
        </div>

        <div className={styles.cardRow}>
          <Chart data={partOfSpeechData} />
          <ChartLegend data={partOfSpeechData} />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardRow}>
          <Icon icon={FaBrain} size="small" />
          {'words by mastery'}
        </div>

        <div className={styles.cardRow}>
          <Chart data={masteryData} />
          <ChartLegend data={masteryData} />
        </div>
      </div>
    </div>
  );
};

type ChartEntry = {
  color: string;
  title: string;
  value: number;
};

type ChartProps = {
  data: ChartEntry[];
};

const Chart: React.FC<ChartProps> = ({ data }) => {
  return (
    <PieChart
      data={data}
      lineWidth={30}
      paddingAngle={5}
      startAngle={-45}
      style={{
        width: '150px',
      }}
    />
  );
};

type ChartLegendProps = {
  data: ChartEntry[];
};

const ChartLegend: React.FC<ChartLegendProps> = ({ data }) => {
  return (
    <div className={styles.legend}>
      {data.map(({ color, title, value }) => (
        <div className={styles.legendRow}>
          <div
            className={styles.legendIcon}
            style={{ backgroundColor: color }}
          />
          {title}
          <span className={styles.number}>{value}</span>
        </div>
      ))}
    </div>
  );
};
