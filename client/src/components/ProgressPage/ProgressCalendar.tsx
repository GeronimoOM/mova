import { useLazyQuery } from '@apollo/client';
import { DateTime, WeekdayNumbers } from 'luxon';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaBook, FaBrain } from 'react-icons/fa6';
import { HiLightningBolt } from 'react-icons/hi';
import {
  GetProgressHistoryDocument,
  GoalFieldsFragment,
  ProgressCadence,
  ProgressType,
} from '../../api/types/graphql';
import { breakpoints, hover } from '../../index.css';
import { sequence } from '../../utils/arrays';
import {
  DISPLAY_DATE_FORMAT,
  DISPLAY_MONTH_DAY_FORMAT,
  DISPLAY_MONTH_FORMAT,
  DISPLAY_WEEKDAY_FORMAT,
  N_WEEKDAYS,
} from '../../utils/constants';
import { Locale } from '../../utils/translator';
import { useMediaQuery } from '../../utils/useMediaQuery';
import { useLanguageContext } from '../LanguageContext';
import { useUserContext } from '../UserContext';
import { ButtonIcon } from '../common/ButtonIcon';
import { Dropdown } from '../common/Dropdown';
import { Icon } from '../common/Icon';
import * as styles from './ProgressCalendar.css';
import { progressTypeToColor } from './progress';
import {
  ProgressCalendarInstance,
  emptyCalendarData,
  getGroupedMonths,
  parseCalendarData,
} from './progressCalendar';

export const ProgressCalendar = () => {
  const [selectedLanguageId] = useLanguageContext();

  const [selectedType, setSelectedType] = useState<ProgressType>(
    ProgressType.Mastery,
  );

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
          />
        </table>

        <div className={styles.footer}>
          <ButtonIcon
            icon={FaBrain}
            color="secondary1"
            toggled={selectedType === ProgressType.Mastery}
            onClick={() => setSelectedType(ProgressType.Mastery)}
          />
          <ButtonIcon
            icon={FaBook}
            color="secondary2"
            toggled={selectedType === ProgressType.Words}
            onClick={() => setSelectedType(ProgressType.Words)}
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

const ProgressCalendarHeader = ({
  weeklyData,
}: ProgressCalendarHeaderProps) => {
  const months: Array<{ month: number; span: number }> = useMemo(() => {
    return getGroupedMonths(weeklyData);
  }, [weeklyData]);

  const { settings } = useUserContext();
  const locale = settings.selectedLocale as Locale;

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
};

const ProgressCalendarBody = ({
  type,
  dailyData,
  weeklyData,
  goal,
}: ProgressCalendarBodyProps) => {
  const { t } = useTranslation();
  const { settings } = useUserContext();
  const locale = settings.selectedLocale as Locale;

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
};

const ProgressCalendarCell = ({
  type,
  cadence,
  instance,
  goal,
}: ProgressCalendarCellProps) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const canHover = useMediaQuery(hover.enabled);

  const points = instance?.points ?? 0;
  const useColor = useMemo(() => goal && points > 0, [goal, points]);
  const color = useColor ? progressTypeToColor[type] : undefined;

  const opacity = useMemo(() => {
    if (!goal || !color) {
      return 100;
    }

    const goalPoints =
      cadence === goal.cadence
        ? goal.points
        : goal.cadence === ProgressCadence.Weekly
          ? goal.points / 7
          : goal.points * 7;
    const progress = points / goalPoints;

    if (progress >= 1) {
      return 100;
    } else if (progress >= 0.8) {
      return 80;
    } else if (progress >= 0.5) {
      return 60;
    } else {
      return 30;
    }
  }, [points, color, cadence, goal]);

  return (
    instance && (
      <Dropdown
        isOpen={isTooltipOpen}
        onOpen={setIsTooltipOpen}
        content={
          <ProgressCalendarCellTooltip
            type={type}
            cadence={cadence}
            date={instance.date}
            points={instance.points}
          />
        }
      >
        <div
          className={styles.cellWrapper({ selected: isTooltipOpen })}
          onClick={(e) => canHover && e.stopPropagation()}
          onMouseEnter={() => setIsTooltipOpen(true)}
          onMouseLeave={() => setIsTooltipOpen(false)}
        >
          <div
            style={{ opacity: `${opacity / 100}` }}
            className={styles.cell({
              color,
            })}
          />
        </div>
      </Dropdown>
    )
  );
};

type ProgressCalendarCellTooltipProps = {
  type: ProgressType;
  cadence: ProgressCadence;
  date: DateTime;
  points: number;
};

const ProgressCalendarCellTooltip = ({
  type,
  cadence,
  date,
  points,
}: ProgressCalendarCellTooltipProps) => {
  const { settings } = useUserContext();
  const locale = settings.selectedLocale as Locale;
  const { t } = useTranslation();

  let dateString;
  if (cadence === ProgressCadence.Daily) {
    dateString = date.setLocale(locale).toFormat(DISPLAY_DATE_FORMAT);
  } else {
    const until = date.plus({ weeks: 1 }).minus({ days: 1 });
    const dateFrom = date
      .setLocale(locale)
      .toFormat(
        date.month === until.month
          ? DISPLAY_MONTH_DAY_FORMAT
          : DISPLAY_DATE_FORMAT,
      );
    const dateUntil = until.setLocale(locale).toFormat(DISPLAY_DATE_FORMAT);
    dateString = `${dateFrom} - ${dateUntil}`;
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
