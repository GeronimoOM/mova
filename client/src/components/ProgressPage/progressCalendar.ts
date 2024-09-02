import { DateTime, Duration } from 'luxon';
import {
  ProgressCadence,
  ProgressHistoryFieldsFragment,
} from '../../api/types/graphql';
import { sequence } from '../../utils/arrays';
import { fromTimestamp } from '../../utils/datetime';

const DEFAULT_HISTORY_SPAN = Duration.fromObject({ months: 3 });
const SHORTENED_HISTORY_SPAN = Duration.fromObject({ months: 2 });

export type ProgressCalendarInstance = {
  date: DateTime;
  points: number;
};

export function parseCalendarData(
  history: ProgressHistoryFieldsFragment,
  isFullCalendar: boolean,
): Array<ProgressCalendarInstance | undefined> {
  const isDailyCadence = history.cadence === ProgressCadence.Daily;
  let from = fromTimestamp(history.from, true)!;
  const until = fromTimestamp(history.until, true)!;

  if (!isFullCalendar) {
    const today = DateTime.local();
    from = today
      .minus(SHORTENED_HISTORY_SPAN)
      .startOf(isDailyCadence ? 'day' : 'week');
  }

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

export function emptyCalendarData(
  cadence: ProgressCadence,
  isFullCalendar: boolean,
): Array<ProgressCalendarInstance | undefined> {
  const isDailyCadence = cadence === ProgressCadence.Daily;
  const today = DateTime.local();
  const from = today
    .minus(isFullCalendar ? DEFAULT_HISTORY_SPAN : SHORTENED_HISTORY_SPAN)
    .startOf(isDailyCadence ? 'day' : 'week');
  const until = today
    .plus(isDailyCadence ? { days: 1 } : { week: 1 })
    .startOf(isDailyCadence ? 'day' : 'week');
  const total = until.diff(from, isDailyCadence ? 'days' : 'weeks')[
    isDailyCadence ? 'days' : 'weeks'
  ];

  let instances: Array<ProgressCalendarInstance | undefined> = sequence(
    total,
  ).map((offset) => ({
    date: from.plus({ [isDailyCadence ? 'days' : 'weeks']: offset }),
    points: 0,
  }));

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
