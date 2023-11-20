import { Component, Show, For } from 'solid-js';
import { DateTime } from 'luxon';
import { WordsByDateStats } from '../../api/types/graphql';
import { DATE_FORMAT } from '../../utils/constants';
import { seq } from '../../utils/arrays';

const N_WEEKDAYS = 7;
const WEEKDAY_FORMAT = 'ccc';
const MONTH_FORMAT = 'LLL';

const WORDS_THRESHOLD_TO_COLOR: [number, string][] = [
  [30, 'bg-violet-800'],
  [10, 'bg-violet-600'],
  [3, 'bg-violet-400'],
  [0, 'bg-violet-300'],
  [-1, 'bg-neutral-100'],
];

export type StatisticsCalendarProps = {
  stats: WordsByDateStats;
};

export const StatisticsCalendar: Component<StatisticsCalendarProps> = (
  props,
) => {
  const fromDate = DateTime.fromFormat(props.stats.from, DATE_FORMAT);
  const untilDate = DateTime.fromFormat(props.stats.until, DATE_FORMAT);
  const fromOffset = fromDate.weekday - 1;
  const totalDays = untilDate.diff(fromDate, 'days').days;
  const totalWeeks = Math.ceil(totalDays / N_WEEKDAYS);

  const statsByDayDiff = Object.fromEntries(
    props.stats.dates.map((dateStats) => [
      DateTime.fromFormat(dateStats.date, DATE_FORMAT).diff(fromDate, 'days')
        .days,
      {
        ...dateStats,
        date: DateTime.fromFormat(dateStats.date, DATE_FORMAT),
      },
    ]),
  );
  const stats = seq(totalDays).map(
    (dayDiff) =>
      statsByDayDiff[dayDiff] ?? {
        date: fromDate.plus({ days: dayDiff }),
        words: 0,
      },
  );

  return (
    <div class="overflow-visible">
      <table>
        <StatisticsCalendarHeader fromDate={fromDate} untilDate={untilDate} />
        <tbody>
          <For each={seq(N_WEEKDAYS)}>
            {(dayOfWeek) => (
              <tr>
                <td>
                  <div class="px-1 text-xs">
                    {DateTime.fromObject({ weekday: dayOfWeek + 1 }).toFormat(
                      WEEKDAY_FORMAT,
                    )}
                  </div>
                </td>

                <For each={seq(totalWeeks)}>
                  {(week) => {
                    const dayDiff = week * N_WEEKDAYS + dayOfWeek - fromOffset;

                    return (
                      <td>
                        <Show when={stats[dayDiff]}>
                          <StatisticsCalendarCell stats={stats[dayDiff]} />
                        </Show>
                      </td>
                    );
                  }}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </div>
  );
};

type StatisticCalendarHeaderProps = {
  fromDate: DateTime;
  untilDate: DateTime;
};

export const StatisticsCalendarHeader: Component<
  StatisticCalendarHeaderProps
> = (props) => {
  const totalDays = props.untilDate.diff(props.fromDate, 'days').days;
  const totalWeeks = Math.ceil(totalDays / N_WEEKDAYS);

  let currentMonth: { month: number; span: number } | null = null;
  const months = seq(totalWeeks)
    .map(
      (week) =>
        props.fromDate
          .minus({ days: props.fromDate.weekday - 1 })
          .plus({ weeks: week }).month,
    )
    .reduce(
      (months, month) => {
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

  return (
    <thead>
      <tr>
        <td />
        <For each={months}>
          {({ month, span }) => (
            <td colSpan={span}>
              <div class="px-1 text-xs">
                {span > 2
                  ? DateTime.fromObject({ month }).toFormat(MONTH_FORMAT)
                  : ''}
              </div>
            </td>
          )}
        </For>
      </tr>
    </thead>
  );
};

type StatisticsCalendarCellProps = {
  stats: {
    date: DateTime;
    words: number;
  };
};

export const StatisticsCalendarCell: Component<StatisticsCalendarCellProps> = (
  props,
) => {
  const color = () =>
    Object.values(WORDS_THRESHOLD_TO_COLOR).find(
      ([threshold]) => props.stats!.words > Number(threshold),
    )![1];

  return (
    <div class="group relative p-0.5">
      <div class={`h-4 w-4 ${color()}`}>
        <div
          class={`absolute top-full z-10 hidden select-none p-1 group-hover:inline-block `}
        >
          <div class="w-fit whitespace-nowrap bg-spacecadet-300 p-1 text-sm text-white">
            <p>
              {props.stats!.date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}
            </p>
            <p>{props.stats!.words} words added</p>
          </div>
        </div>
      </div>
    </div>
  );
};
