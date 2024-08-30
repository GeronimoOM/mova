import { useLazyQuery, useQuery } from '@apollo/client';
import { DateTime, WeekdayNumbers } from 'luxon';
import React, { useEffect, useMemo, useState } from 'react';
import { FaBook, FaBrain } from 'react-icons/fa6';
import { TbTargetArrow } from 'react-icons/tb';
import {
  GetGoalsDocument,
  GetProgressHistoryDocument,
  GoalFieldsFragment,
  ProgressCadence,
  ProgressType,
} from '../../api/types/graphql';
import { sequence, toRecord } from '../../utils/arrays';
import { useLanguageContext } from '../LanguageContext';
import { ButtonIcon } from '../common/ButtonIcon';
import * as styles from './ProgressCalendar.css';
import { progressTypeToColor } from './progress';
import {
  ProgressCalendarInstance,
  emptyCalendarData,
  getGroupedMonths,
  parseCalendarData,
} from './progressCalendar';

const N_WEEKDAYS = 7;
const WEEKDAY_FORMAT = 'ccc';
const MONTH_FORMAT = 'LLL';

export const ProgressCalendar: React.FC = () => {
  const [selectedLanguageId] = useLanguageContext();

  const [selectedType, setSelectedType] = useState<ProgressType>(
    ProgressType.Words,
  );
  const [isGoalOnly, setIsGoalOnly] = useState(false);

  const { data: goalsQuery } = useQuery(GetGoalsDocument, {
    variables: { languageId: selectedLanguageId! },
  });
  const goals = goalsQuery?.language?.goals;
  const goalByType = useMemo(
    () => (goals ? toRecord(goals, (goal) => goal.type) : undefined),
    [goals],
  );
  const goal = goalByType?.[selectedType];

  const [fetchProgressHistory, { data: progressHistory }] = useLazyQuery(
    GetProgressHistoryDocument,
    {
      fetchPolicy: 'network-only',
    },
  );
  const dailyHistory = progressHistory?.language?.progress.dailyHistory;
  const weeklyHistory = progressHistory?.language?.progress.weeklyHistory;

  const [dailyData, weeklyData] = useMemo(
    () => [
      dailyHistory
        ? parseCalendarData(dailyHistory)
        : emptyCalendarData(ProgressCadence.Daily),
      weeklyHistory
        ? parseCalendarData(weeklyHistory)
        : emptyCalendarData(ProgressCadence.Weekly),
    ],
    [dailyHistory, weeklyHistory],
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

      <div className={styles.typeButtons}>
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
          color="primary"
          toggled={isGoalOnly}
          onClick={() => setIsGoalOnly(!isGoalOnly)}
        />
      </div>
    </div>
  );
};

type ProgressCalendarHeaderProps = {
  weeklyData?: Array<ProgressCalendarInstance | undefined>;
};

const ProgressCalendarHeader: React.FC<ProgressCalendarHeaderProps> = ({
  weeklyData,
}) => {
  const months: Array<{ month: number; span: number }> = useMemo(() => {
    return weeklyData ? getGroupedMonths(weeklyData) : [];
  }, [weeklyData]);

  return (
    <thead>
      <tr>
        <td />
        {months.map(({ month, span }) => (
          <td key={month} colSpan={span} className={styles.monthLabel}>
            {span > 2
              ? DateTime.fromObject({ month }).toFormat(MONTH_FORMAT)
              : ''}
          </td>
        ))}
      </tr>
    </thead>
  );
};

type ProgressCalendarBodyProps = {
  type: ProgressType;
  dailyData?: Array<ProgressCalendarInstance | undefined>;
  weeklyData?: Array<ProgressCalendarInstance | undefined>;
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
  return (
    <tbody>
      {sequence(N_WEEKDAYS).map((weekday) => (
        <tr key={weekday}>
          <td className={styles.weekLabel}>
            {DateTime.fromObject({
              weekday: (weekday + 1) as WeekdayNumbers,
            }).toFormat(WEEKDAY_FORMAT)}
          </td>

          {sequence(weeklyData?.length ?? 0).map((week) => (
            <td key={week}>
              <ProgressCalendarCell
                type={type}
                cadence={ProgressCadence.Daily}
                instance={dailyData?.[week * N_WEEKDAYS + weekday]}
                goal={goal}
                isGoalOnly={isGoalOnly}
              />
            </td>
          ))}
        </tr>
      ))}

      <tr key="week">
        <td className={styles.weekLabel}>Week</td>

        {sequence(weeklyData?.length ?? 0).map((week) => (
          <td key={week}>
            <ProgressCalendarCell
              type={type}
              cadence={ProgressCadence.Weekly}
              instance={weeklyData?.[week]}
              goal={goal}
              isGoalOnly={isGoalOnly}
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
};

const ProgressCalendarCell: React.FC<ProgressCalendarCellProps> = ({
  type,
  cadence,
  instance,
  goal,
  isGoalOnly,
}) => {
  const points = instance?.points ?? 0;
  const useColor =
    goal &&
    (isGoalOnly
      ? goal.cadence === cadence && points >= goal.points
      : points > 0);
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
      <div
        className={styles.cell({
          color,
          intensity,
        })}
      />
    )
  );
};
