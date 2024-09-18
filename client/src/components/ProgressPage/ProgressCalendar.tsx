import { useLazyQuery } from '@apollo/client';
import { DateTime, WeekdayNumbers } from 'luxon';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBook, FaBrain } from 'react-icons/fa6';
import { HiLightningBolt } from 'react-icons/hi';
import { TbTargetArrow } from 'react-icons/tb';
import {
  GetProgressHistoryDocument,
  GoalFieldsFragment,
  ProgressCadence,
  ProgressType,
} from '../../api/types/graphql';
import { breakpoints } from '../../index.css';
import { sequence } from '../../utils/arrays';
import {
  DISPLAY_DATE_FORMAT,
  DISPLAY_MONTH_FORMAT,
  DISPLAY_WEEKDAY_FORMAT,
  N_WEEKDAYS,
} from '../../utils/constants';
import { useMediaQuery } from '../../utils/useMediaQuery';
import { useLanguageContext } from '../LanguageContext';
import { useLocaleContext } from '../LocaleContext';
import { ButtonIcon } from '../common/ButtonIcon';
import { Icon } from '../common/Icon';
import { Tooltip } from '../common/Tooltip';
import * as styles from './ProgressCalendar.css';
import { progressTypeToColor } from './progress';
import {
  ProgressCalendarInstance,
  emptyCalendarData,
  getGroupedMonths,
  parseCalendarData,
} from './progressCalendar';

export const ProgressCalendar: React.FC = () => {
  const [selectedLanguageId] = useLanguageContext();

  const [selectedType, setSelectedType] = useState<ProgressType>(
    ProgressType.Words,
  );
  const [isGoalOnly, setIsGoalOnly] = useState(false);

  const [fetchProgressHistory, { data: progressHistory }] = useLazyQuery(
    GetProgressHistoryDocument,
    {
      fetchPolicy: 'cache-and-network',
    },
  );
  const {
    cadence,
    goal,
    streak = 0,
    dailyHistory,
    weeklyHistory,
  } = progressHistory?.language?.progress ?? {};

  const { t } = useTranslation();

  const color = progressTypeToColor[selectedType];
  const hasStreak = streak > 0;
  const streakLabel =
    cadence === ProgressCadence.Daily
      ? t('progress.days', { count: streak })
      : t('progress.weeks', { count: streak });

  const isFullCalendar = useMediaQuery(breakpoints.tiny);

  const [dailyData, weeklyData] = useMemo(
    () => [
      dailyHistory
        ? parseCalendarData(dailyHistory, isFullCalendar)
        : emptyCalendarData(ProgressCadence.Daily, isFullCalendar),
      weeklyHistory
        ? parseCalendarData(weeklyHistory, isFullCalendar)
        : emptyCalendarData(ProgressCadence.Weekly, isFullCalendar),
    ],
    [dailyHistory, weeklyHistory, isFullCalendar],
  );

  useEffect(() => {
    fetchProgressHistory({
      variables: {
        languageId: selectedLanguageId!,
        type: selectedType,
      },
    });
  }, [selectedLanguageId, selectedType, fetchProgressHistory]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <ProgressCalendarHeader weeklyData={weeklyData} />
          <ProgressCalendarBody
            type={selectedType}
            dailyData={dailyData}
            weeklyData={weeklyData}
            goal={goal}
            isGoalOnly={isGoalOnly}
          />
        </table>

        <div className={styles.footer}>
          <ButtonIcon
            icon={FaBook}
            color="secondary2"
            toggled={selectedType === ProgressType.Words}
            onClick={() => setSelectedType(ProgressType.Words)}
          />
          <ButtonIcon
            icon={FaBrain}
            color="secondary1"
            toggled={selectedType === ProgressType.Mastery}
            onClick={() => setSelectedType(ProgressType.Mastery)}
          />
          <ButtonIcon
            icon={TbTargetArrow}
            color={color}
            toggled={isGoalOnly}
            onClick={() => setIsGoalOnly(!isGoalOnly)}
          />

          <div className={styles.streak({ ...(hasStreak && { color }) })}>
            <Icon icon={HiLightningBolt} />
            <div className={styles.streakNumber}>{streak}</div>
            <div className={styles.streakLabel}>{streakLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

type ProgressCalendarHeaderProps = {
  weeklyData: Array<ProgressCalendarInstance | undefined>;
};

const ProgressCalendarHeader: React.FC<ProgressCalendarHeaderProps> = ({
  weeklyData,
}) => {
  const months: Array<{ month: number; span: number }> = useMemo(() => {
    return getGroupedMonths(weeklyData);
  }, [weeklyData]);

  const [locale] = useLocaleContext();

  return (
    <thead>
      <tr>
        <td />
        {months.map(({ month, span }) => (
          <td key={month} colSpan={span} className={styles.monthLabel}>
            {span > 2
              ? DateTime.fromObject({ month })
                  .setLocale(locale)
                  .toFormat(DISPLAY_MONTH_FORMAT)
              : ''}
          </td>
        ))}
      </tr>
    </thead>
  );
};

type ProgressCalendarBodyProps = {
  type: ProgressType;
  dailyData: Array<ProgressCalendarInstance | undefined>;
  weeklyData: Array<ProgressCalendarInstance | undefined>;
  goal?: GoalFieldsFragment;
  isGoalOnly?: boolean;
};

const ProgressCalendarBody: React.FC<ProgressCalendarBodyProps> = ({
  type,
  dailyData,
  weeklyData,
  goal,
  isGoalOnly,
}) => {
  const { t } = useTranslation();
  const [locale] = useLocaleContext();

  return (
    <tbody>
      {sequence(N_WEEKDAYS).map((weekday) => (
        <tr key={weekday}>
          <td className={styles.weekLabel}>
            {DateTime.fromObject({
              weekday: (weekday + 1) as WeekdayNumbers,
            })
              .setLocale(locale)
              .toFormat(DISPLAY_WEEKDAY_FORMAT)}
          </td>

          {sequence(weeklyData.length).map((week) => (
            <td key={week}>
              <ProgressCalendarCell
                type={type}
                cadence={ProgressCadence.Daily}
                instance={dailyData?.[week * N_WEEKDAYS + weekday]}
                goal={goal}
                isGoalOnly={isGoalOnly}
                tooltipSide={getTooltipSide(week, weeklyData.length)}
              />
            </td>
          ))}
        </tr>
      ))}

      <tr key="week">
        <td className={styles.weekLabel}>{t('progress.week')}</td>

        {sequence(weeklyData.length).map((week) => (
          <td key={week}>
            <ProgressCalendarCell
              type={type}
              cadence={ProgressCadence.Weekly}
              instance={weeklyData?.[week]}
              goal={goal}
              isGoalOnly={isGoalOnly}
              tooltipSide={getTooltipSide(week, weeklyData.length)}
            />
          </td>
        ))}
      </tr>
    </tbody>
  );
};

type ProgressCalendarCellProps = {
  type: ProgressType;
  cadence: ProgressCadence;
  instance?: ProgressCalendarInstance;
  goal?: GoalFieldsFragment;
  isGoalOnly?: boolean;
  tooltipSide: 'top' | 'left' | 'right';
};

const ProgressCalendarCell: React.FC<ProgressCalendarCellProps> = ({
  type,
  cadence,
  instance,
  goal,
  isGoalOnly,
  tooltipSide,
}) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const points = instance?.points ?? 0;
  const useColor = useMemo(
    () =>
      goal &&
      (isGoalOnly
        ? goal.cadence === cadence && points >= goal.points
        : points > 0),
    [cadence, goal, isGoalOnly, points],
  );
  const color = useColor ? progressTypeToColor[type] : undefined;

  const intensity = useMemo(() => {
    if (!goal || !color) {
      return undefined;
    }

    const progress = points / goal.points;

    if (progress >= 1) {
      return 100;
    } else if (progress >= 0.8) {
      return 80;
    } else if (progress >= 0.5) {
      return 60;
    } else {
      return 30;
    }
  }, [points, goal, color]);

  return (
    instance && (
      <Tooltip
        content={
          <ProgressCalendarCellTooltip
            type={type}
            cadence={cadence}
            date={instance.date}
            points={instance.points}
          />
        }
        side={tooltipSide}
        onOpen={setIsTooltipOpen}
      >
        <div className={styles.cellWrapper({ selected: isTooltipOpen })}>
          <div
            className={styles.cell({
              color,
              intensity,
            })}
          />
        </div>
      </Tooltip>
    )
  );
};

type ProgressCalendarCellTooltipProps = {
  type: ProgressType;
  cadence: ProgressCadence;
  date: DateTime;
  points: number;
};

const ProgressCalendarCellTooltip: React.FC<
  ProgressCalendarCellTooltipProps
> = ({ type, cadence, date, points }) => {
  const [locale] = useLocaleContext();
  const { t } = useTranslation();

  let dateString;
  if (cadence === ProgressCadence.Daily) {
    dateString = date.setLocale(locale).toFormat(DISPLAY_DATE_FORMAT);
  } else {
    const until = date.plus({ weeks: 1 }).minus({ days: 1 });
    dateString = `${date.setLocale(locale).toFormat(DISPLAY_DATE_FORMAT)} - ${until.setLocale(locale).toFormat(DISPLAY_DATE_FORMAT)}`;
  }

  const pointsString =
    type === ProgressType.Words
      ? t('progress.wordsAdded', { count: points })
      : t('progress.pointsEarned', { count: points });

  const color = points > 0 ? progressTypeToColor[type] : undefined;

  return (
    <div className={styles.cellTooltip}>
      <div className={styles.cellTooltipDate}>{dateString}</div>
      <div>
        <span className={styles.cellTooltipPoints({ color })}>{points}</span>
        {` ${pointsString}`}
      </div>
    </div>
  );
};

const getTooltipSide = (
  week: number,
  totalWeeks: number,
): 'top' | 'left' | 'right' => {
  if (week <= 3) {
    return 'right';
  } else if (week >= totalWeeks - 4) {
    return 'left';
  } else {
    return 'top';
  }
};
