import { DateTime } from 'luxon';
import {
  ProgressCadence,
  ProgressHistoryFieldsFragment,
} from '../../api/types/graphql';
import { sequence } from '../../utils/arrays';
import { fromTimestamp } from '../../utils/datetime';

export type ProgressCalendarInstance = {
  date: DateTime;
  points: number;
};

export function parseHistoryToCalendarData(
  history: ProgressHistoryFieldsFragment,
): Array<ProgressCalendarInstance | undefined> {
  const isDailyCadence = history.cadence === ProgressCadence.Daily;
  const from = fromTimestamp(history.from, true)!;
  const until = fromTimestamp(history.until, true)!;

  const total = until.diff(from, isDailyCadence ? 'days' : 'weeks')[
    isDailyCadence ? 'days' : 'weeks'
  ];

  const progressByOffset = Object.fromEntries(
    history.instances.map(({ points, date }) => {
      const instanceDate = fromTimestamp(date, true)!;
      return [
        instanceDate.diff(from, isDailyCadence ? 'days' : 'weeks')[
          isDailyCadence ? 'days' : 'weeks'
        ],
        {
          points,
          date: instanceDate,
        },
      ];
    }),
  );

  let instances: Array<ProgressCalendarInstance | undefined> = sequence(
    total,
  ).map(
    (offset) =>
      progressByOffset[offset] ?? {
        date: from.plus({ [isDailyCadence ? 'days' : 'weeks']: offset }),
        points: 0,
      },
  );

  if (isDailyCadence) {
    const dailyOffset = from.weekday - 1;
    instances = [...sequence(dailyOffset).map(() => undefined), ...instances];
  }

  return instances;
}

export function getGroupedMonths(
  weeklyData: Array<ProgressCalendarInstance | undefined>,
): Array<{
  month: number;
  span: number;
}> {
  let currentMonth: { month: number; span: number } | null = null;
  return weeklyData.reduce(
    (months, instance) => {
      const month = instance!.date.month;

      if (!currentMonth || month !== currentMonth.month) {
        currentMonth = { month, span: 1 };
        months.push(currentMonth);
      } else {
        currentMonth.span++;
      }
      return months;
    },
    [] as Array<{ month: number; span: number }>,
  );
}
