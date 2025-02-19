import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBook, FaBrain } from 'react-icons/fa6';
import { PiGraphBold } from 'react-icons/pi';
import { PieChart } from 'react-minimal-pie-chart';
import { GetStatsDocument } from '../../api/types/graphql';
import { masteries, masteryToColor, masteryToLabel } from '../../utils/mastery';
import {
  partOfSpeechToColor,
  partOfSpeechToFullLabel,
  partsOfSpeech,
} from '../../utils/partsOfSpeech';
import { useLanguageContext } from '../LanguageContext';
import { Icon } from '../common/Icon';
import * as styles from './StatsTab.css';

export const StatsTab = () => {
  const [selectedLanguageId] = useLanguageContext();

  const { data: statsQuery } = useQuery(GetStatsDocument, {
    variables: { languageId: selectedLanguageId! },
    fetchPolicy: 'cache-and-network',
  });
  const stats = statsQuery?.language?.stats;
  const total = stats?.total;
  const byMastery = stats?.mastery;
  const byPartOfSpeech = stats?.partsOfSpeech;

  const { t } = useTranslation();

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
          title: partOfSpeechToFullLabel[partOfSpeech],
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
          {t('stats.total')}
          <span className={styles.number}>{total}</span>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardRow}>
          <Icon icon={PiGraphBold} size="small" />
          {t('stats.byPartOfSpeech')}
        </div>

        <div className={styles.cardRow}>
          <Chart data={partOfSpeechData} />
          <ChartLegend data={partOfSpeechData} />
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardRow}>
          <Icon icon={FaBrain} size="small" />
          {t('stats.byMastery')}
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

const Chart = ({ data }: ChartProps) => {
  return (
    <PieChart
      data={data}
      lineWidth={30}
      paddingAngle={5}
      startAngle={-45}
      style={{
        width: '120px',
        margin: '0 auto',
      }}
    />
  );
};

type ChartLegendProps = {
  data: ChartEntry[];
};

const ChartLegend = ({ data }: ChartLegendProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.legend}>
      {data.map(({ color, title, value }) => (
        <div key={title} className={styles.legendRow}>
          <div
            className={styles.legendIcon}
            style={{ backgroundColor: color }}
          />
          {t(title)}
          <span className={styles.number}>{value}</span>
        </div>
      ))}
    </div>
  );
};
